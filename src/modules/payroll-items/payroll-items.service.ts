import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PayrollItem } from '../../models/payroll-item.entity';
import { PayrollRun } from '../../models/payroll-run.entity';
import { PayrollPeriod } from '../../models/payroll-period.entity';
import { CreatePayrollItemDto } from './dto/create-payroll-item.dto';
import { UpdatePayrollItemDto } from './dto/update-payroll-item.dto';

@Injectable()
export class PayrollItemService {
  constructor(
    @InjectRepository(PayrollItem)
    private readonly repo: Repository<PayrollItem>,
    @InjectRepository(PayrollRun)
    private readonly payrollRunRepo: Repository<PayrollRun>,
    @InjectRepository(PayrollPeriod)
    private readonly payrollPeriodRepo: Repository<PayrollPeriod>,
  ) {}

  create(hotelId: string, dto: CreatePayrollItemDto) {
    const entity = this.repo.create({ ...(dto as any), hotelId });
    return this.repo.save(entity);
  }

  async findAll(hotelId: string, page = 1, limit = 25, sortBy?: string, sortOrder: 'ASC' | 'DESC' = 'ASC', payrollRunId?: string) {
    const skip = (page - 1) * limit;
    const order = sortBy ? { [sortBy]: sortOrder } : {};
    const where: any = { hotelId };
    if (payrollRunId) where.payrollRunId = payrollRunId;
    const [data, total] = await this.repo.findAndCount({
      where,
      skip,
      take: limit,
      order,
    });
    return { data, total, page, limit };
  }

  async findOne(id: string, hotelId: string) {
    const record = await this.repo.findOne({ where: { id, hotelId } as any });
    if (!record) {
      throw new NotFoundException(`PayrollItem ${id} not found`);
    }
    return record;
  }

  async update(id: string, hotelId: string, dto: UpdatePayrollItemDto) {
    const record = await this.findOne(id, hotelId);
    Object.assign(record, dto);
    return this.repo.save(record);
  }

  async remove(id: string, hotelId: string) {
    const record = await this.findOne(id, hotelId);
    return this.repo.remove(record);
  }

  // Employee self-service: list all payslips for the logged-in employee
  async findMine(hotelId: string, employeeId: string, page = 1, limit = 25) {
    const skip = (page - 1) * limit;
    const [items, total] = await this.repo.findAndCount({
      where: { hotelId, employeeId } as any,
      order: { createdAt: 'DESC' } as any,
      skip,
      take: limit,
    });

    if (items.length === 0) return { data: [], total, page, limit };

    // Load all needed runs and periods in two bulk queries (no N+1)
    const runIds = [...new Set(items.map((i) => i.payrollRunId))];
    const runs = await this.payrollRunRepo.find({ where: { id: In(runIds) } as any });
    const runMap = Object.fromEntries(runs.map((r) => [r.id, r]));

    const periodIds = [...new Set(runs.map((r) => r.payrollPeriodId))];
    const periods = await this.payrollPeriodRepo.find({ where: { id: In(periodIds) } as any });
    const periodMap = Object.fromEntries(periods.map((p) => [p.id, p]));

    const data = items.map((item) => {
      const run = runMap[item.payrollRunId];
      const period = run ? periodMap[run.payrollPeriodId] : null;
      return { ...item, period, runStatus: run?.status };
    });

    return { data, total, page, limit };
  }

  // Employee self-service: full breakdown of a single payslip
  async findMineById(id: string, hotelId: string, employeeId: string) {
    const item = await this.repo.findOne({
      where: { id, hotelId, employeeId } as any,
    });
    if (!item) throw new NotFoundException('Payslip not found');

    const run = await this.payrollRunRepo.findOne({
      where: { id: item.payrollRunId } as any,
    });
    const period = run
      ? await this.payrollPeriodRepo.findOne({ where: { id: run.payrollPeriodId } as any })
      : null;

    return { ...item, period, runStatus: run?.status };
  }
}
