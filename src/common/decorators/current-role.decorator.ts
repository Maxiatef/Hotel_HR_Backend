import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Pulls role off the authenticated request (set by HotelScopeGuard from the JWT payload).
 * Use in any controller method: @CurrentRole() role: string
 */
export const CurrentRole = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.role;
  },
);
