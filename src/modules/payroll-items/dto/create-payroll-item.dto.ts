/**
 * Generic DTO — accepts the entity's writable fields as `any`.
 * See src/modules/employees/dto/create-employee.dto.ts for the fully-typed,
 * class-validator version; apply that same pattern here when you're ready.
 */
export class CreatePayrollItemDto {
  payrollRunId?: any;
  employeeId?: any;
  baseSalary?: any;
  fixedAllowances?: any;
  bonusTotal?: any;
  deductionTotal?: any;
  overtimeTotal?: any;
  leaveDeductionTotal?: any;
  loanDeductionTotal?: any;
  socialInsuranceTotal?: any;
  taxTotal?: any;
  netSalary?: any;
}
