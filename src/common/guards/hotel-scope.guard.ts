import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

/**
 * Every HR user logs in already scoped to one hotel (they pick the hotel before signing in,
 * see the auth module). The JWT payload carries { hotelId, role, sub }.
 *
 * This guard verifies the token and attaches hotelId/role to the request so that every
 * controller/service call is automatically filtered to that hotel. A "superadmin" role
 * may pass an explicit hotelId query/header to cross hotels for support purposes.
 */
@Injectable()
export class HotelScopeGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const payload = this.jwtService.verify(token);
      request.hotelId = payload.hotelId;
      request.role = payload.role;
      request.userId = payload.sub;

      // super_admin may override hotel scope explicitly via header, e.g. x-hotel-id
      if (payload.role === 'super_admin' && request.headers['x-hotel-id']) {
        request.hotelId = request.headers['x-hotel-id'];
      }

      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
