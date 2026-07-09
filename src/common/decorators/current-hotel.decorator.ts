import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Pulls hotelId off the authenticated request (set by HotelScopeGuard from the JWT payload).
 * Use in any controller method: @CurrentHotel() hotelId: string
 */
export const CurrentHotel = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.hotelId;
  },
);
