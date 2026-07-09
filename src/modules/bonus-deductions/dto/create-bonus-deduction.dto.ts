/**
 * Generic DTO — accepts the entity's writable fields as `any`.
 * See src/modules/employees/dto/create-employee.dto.ts for the fully-typed,
 * class-validator version; apply that same pattern here when you're ready.
 */
export class CreateBonusDeductionDto {
  employeeId?: any;
  payrollPeriodId?: any;
  type?: any;
  reason?: any;
  amount?: any;
  status?: any;
  createdBy?: any;
}
