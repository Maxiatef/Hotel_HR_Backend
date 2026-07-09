/**
 * Generic DTO — accepts the entity's writable fields as `any`.
 * See src/modules/employees/dto/create-employee.dto.ts for the fully-typed,
 * class-validator version; apply that same pattern here when you're ready.
 */
export class CreateHotelDto {
  code?: any;
  name?: any;
  city?: any;
  isActive?: any;
}
