import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Pulls employeeId off the authenticated request (set by HotelScopeGuard from the JWT payload,
 * itself populated from User.employeeId at login). Undefined for accounts not linked to an
 * employee record (e.g. an admin-only user). Use in any controller method: @CurrentEmployee() employeeId: string
 */
export const CurrentEmployee = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.employeeId;
  },
);
