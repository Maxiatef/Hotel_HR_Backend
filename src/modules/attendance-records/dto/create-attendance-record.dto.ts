/**
 * Generic DTO — accepts the entity's writable fields as `any`.
 * See src/modules/employees/dto/create-employee.dto.ts for the fully-typed,
 * class-validator version; apply that same pattern here when you're ready.
 */
export class CreateAttendanceRecordDto {
  employeeId?: any;
  workDate?: any;
  checkIn?: any;
  checkOut?: any;
  overtimeHours?: any;
  status?: any;
}
