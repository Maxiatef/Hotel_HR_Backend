import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { PayrollRun } from '../../models/payroll-run.entity';
import { PayrollItem } from '../../models/payroll-item.entity';
import { PayrollPeriod } from '../../models/payroll-period.entity';
import { Employee } from '../../models/employee.entity';
import { BonusDeduction } from '../../models/bonus-deduction.entity';
import { AttendanceRecord } from '../../models/attendance-record.entity';
import { Loan } from '../../models/loan.entity';
import { Advance } from '../../models/advance.entity';

// Egypt social insurance rate (employee share)
const SOCIAL_INSURANCE_RATE = 0.11;

// Egypt income tax brackets (annual) - 2024 rates
const TAX_BRACKETS = [
  { min: 0, max: 40000, rate: 0 },
  { min: 40000, max: 55000, rate: 0.10 },
  { min: 55000, max: 70000, rate: 0.15 },
  { min: 70000, max: 200000, rate: 0.20 },
  { min: 200000, max: 400000, rate: 0.225 },
  { min: 400000, max: Infinity, rate: 0.25 },
];

// Overtime rate multiplier
const OVERTIME_MULTIPLIER = 1.5;

@Injectable()
export class PayrollCalculationService {
  constructor(
    @InjectRepository(PayrollRun)
    private readonly payrollRunRepo: Repository<PayrollRun>,
    @InjectRepository(PayrollItem)
    private readonly payrollItemRepo: Repository<PayrollItem>,
    @InjectRepository(PayrollPeriod)
    private readonly payrollPeriodRepo: Repository<PayrollPeriod>,
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
    @InjectRepository(BonusDeduction)
    private readonly bonusDeductionRepo: Repository<BonusDeduction>,
    @InjectRepository(AttendanceRecord)
    private readonly attendanceRepo: Repository<AttendanceRecord>,
    @InjectRepository(Loan)
    private readonly loanRepo: Repository<Loan>,
    @InjectRepository(Advance)
    private readonly advanceRepo: Repository<Advance>,
  ) {}

  async processPayroll(payrollRunId: string, hotelId: string): Promise<PayrollRun> {
    const payrollRun = await this.payrollRunRepo.findOne({
      where: { id: payrollRunId, hotelId } as any,
    });

    if (!payrollRun) {
      throw new BadRequestException('Payroll run not found');
    }

    if (payrollRun.status === 'processing') {
      throw new BadRequestException('Payroll run is currently being processed');
    }
    if (payrollRun.status === 'completed') {
      throw new BadRequestException('Payroll run has already been completed');
    }
    if (payrollRun.status === 'approved') {
      throw new BadRequestException('Payroll run has been approved and locked — it cannot be re-processed');
    }

    // Check payroll period status - must be 'open' to process
    const payrollPeriod = await this.payrollPeriodRepo.findOne({
      where: { id: payrollRun.payrollPeriodId } as any,
    });

    if (!payrollPeriod) {
      throw new BadRequestException('Payroll period not found');
    }

    if (payrollPeriod.status !== 'open') {
      throw new BadRequestException(
        `Cannot process payroll run for a ${payrollPeriod.status} period. Only open periods can be processed.`,
      );
    }

    // Update status to processing
    payrollRun.status = 'processing';
    await this.payrollRunRepo.save(payrollRun);

    try {
      // Get all active employees for this hotel
      const employees = await this.employeeRepo.find({
        where: { hotelId, isActive: true } as any,
      });

      const payrollItems: PayrollItem[] = [];
      let totalGross = 0;
      let totalNet = 0;

      for (const employee of employees) {
        const item = await this.calculateEmployeePayroll(
          employee,
          hotelId,
          payrollPeriod,
          payrollRunId,
        );
        payrollItems.push(item);
        totalGross += item.baseSalary + item.bonusTotal + item.overtimeTotal;
        totalNet += item.netSalary;
      }

      // Delete any stale items from a previous failed run before saving new ones
      await this.payrollItemRepo.delete({ payrollRunId } as any);

      // Save all payroll items
      await this.payrollItemRepo.save(payrollItems);

      // Update payroll run totals
      payrollRun.totalGross = totalGross;
      payrollRun.totalNet = totalNet;
      payrollRun.status = 'completed';
      await this.payrollRunRepo.save(payrollRun);

      return payrollRun;
    } catch (error) {
      payrollRun.status = 'failed';
      await this.payrollRunRepo.save(payrollRun);
      throw new BadRequestException(`Payroll calculation failed: ${error.message}`);
    }
  }

  private async calculateEmployeePayroll(
    employee: Employee,
    hotelId: string,
    payrollPeriod: PayrollPeriod,
    payrollRunId: string,
  ): Promise<PayrollItem> {
    const payrollPeriodId = payrollPeriod.id;
    const pad = (n: number) => String(n).padStart(2, '0');
    const periodStartStr = `${payrollPeriod.year}-${pad(payrollPeriod.month)}-01`;
    const lastDay = new Date(payrollPeriod.year, payrollPeriod.month, 0).getDate();
    const periodEndStr = `${payrollPeriod.year}-${pad(payrollPeriod.month)}-${pad(lastDay)}`;

    // ── 1. Hourly rate ────────────────────────────────────────────────────────
    const hourlyRate = Number(employee.hourlyRate) || 0;

    // ── 2. Attendance ─────────────────────────────────────────────────────────
    const attendanceRecords = await this.attendanceRepo.find({
      where: {
        employeeId: employee.id,
        hotelId,
        workDate: Between(periodStartStr, periodEndStr),
      } as any,
    });

    let totalOvertimeHours = 0;
    let totalHoursWorked = 0;
    for (const record of attendanceRecords) {
      totalOvertimeHours += Number(record.overtimeHours) || 0;
      totalHoursWorked += Number(record.hoursWorked) || 0;
    }

    // Base pay: hours present/late × hourly rate. Absent days earn nothing automatically.
    const regularHours = attendanceRecords
      .filter((r) => r.status === 'present' || r.status === 'late')
      .reduce((sum, r) => sum + (Number(r.hoursWorked) || 0), 0);

    const baseSalary = hourlyRate * regularHours;
    const overtimeTotal = hourlyRate * totalOvertimeHours * OVERTIME_MULTIPLIER;

    // ── 3. Bonuses & deductions ───────────────────────────────────────────────
    const bonusDeductions = await this.bonusDeductionRepo.find({
      where: {
        employeeId: employee.id,
        hotelId,
        payrollPeriodId,
        status: 'approved',
      } as any,
    });

    let bonusTotal = 0;
    let deductionTotal = 0;
    for (const bd of bonusDeductions) {
      if (bd.type === 'bonus') bonusTotal += Number(bd.amount);
      else if (bd.type === 'deduction') deductionTotal += Number(bd.amount);
    }

    // ── 4. Loan installments ──────────────────────────────────────────────────
    const activeLoans = await this.loanRepo.find({
      where: { employeeId: employee.id, hotelId, status: 'active' } as any,
    });

    let loanDeductionTotal = 0;
    for (const loan of activeLoans) {
      const installment = Number(loan.monthlyInstallment);
      const remaining = Number(loan.remainingAmount);
      const deduction = Math.min(installment, remaining);
      loanDeductionTotal += deduction;
      loan.remainingAmount = remaining - deduction;
      if (loan.remainingAmount <= 0) loan.status = 'completed';
      await this.loanRepo.save(loan);
    }

    // ── 5. Salary advances ────────────────────────────────────────────────────
    const approvedAdvances = await this.advanceRepo.find({
      where: { employeeId: employee.id, hotelId, status: 'approved' } as any,
    });

    let advanceDeductionTotal = 0;
    for (const advance of approvedAdvances) {
      advanceDeductionTotal += Number(advance.amount);
      advance.status = 'deducted';
      await this.advanceRepo.save(advance);
    }

    // ── 6. Social insurance ───────────────────────────────────────────────────
    const siRate = employee.hasSocialInsurance === false
      ? 0
      : Number(employee.socialInsuranceRate ?? SOCIAL_INSURANCE_RATE);
    const socialInsuranceTotal = baseSalary * siRate;

    // ── 7. Gross salary ───────────────────────────────────────────────────────
    const grossSalary = baseSalary + overtimeTotal + bonusTotal;

    // ── 8. Income tax ─────────────────────────────────────────────────────────
    const taxableIncome = grossSalary - socialInsuranceTotal;

    let taxTotal = 0;
    if (employee.hasTax !== false) {
      if (employee.taxRate != null && Number(employee.taxRate) > 0) {
        taxTotal = taxableIncome * Number(employee.taxRate);
      } else {
        const annualTaxable = taxableIncome * 12;
        let annualTax = 0;
        for (const bracket of TAX_BRACKETS) {
          if (annualTaxable > bracket.min) {
            const inBracket = Math.min(annualTaxable, bracket.max) - bracket.min;
            annualTax += inBracket * bracket.rate;
          }
        }
        taxTotal = annualTax / 12;
      }
    }

    // ── 9. Net salary ─────────────────────────────────────────────────────────
    const netSalary = grossSalary
      - socialInsuranceTotal
      - taxTotal
      - deductionTotal
      - loanDeductionTotal
      - advanceDeductionTotal;

    return this.payrollItemRepo.create({
      payrollRunId,
      employeeId: employee.id,
      hotelId,
      baseSalary,
      fixedAllowances: 0,
      bonusTotal,
      deductionTotal,
      overtimeTotal,
      leaveDeductionTotal: 0,
      loanDeductionTotal,
      advanceDeductionTotal,
      socialInsuranceTotal,
      taxTotal,
      totalHoursWorked: Math.round(totalHoursWorked * 100) / 100,
      totalOvertimeHours: Math.round(totalOvertimeHours * 100) / 100,
      netSalary: Math.max(0, netSalary),
    });
  }
}
