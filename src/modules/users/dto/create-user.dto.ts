/**
 * Generic DTO — accepts the entity's writable fields as `any`.
 * See src/modules/employees/dto/create-employee.dto.ts for the fully-typed,
 * class-validator version; apply that same pattern here when you're ready.
 */
export class CreateUserDto {
  employeeId?: any;
  role?: any;
  username?: any;
  email?: any;
  passwordHash?: any;
  isActive?: any;
  lastLoginAt?: any;
}
