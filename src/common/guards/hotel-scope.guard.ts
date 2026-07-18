import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * Every HR user logs in already scoped to one hotel (they pick the hotel before signing in,
 * see the auth module). The JWT payload carries { hotelId, role, sub }.
 *
 * This guard verifies the token and attaches hotelId/role to the request so that every
 * controller/service call is automatically filtered to that hotel. A "superadmin" role
 * may pass an explicit hotelId query/header to cross hotels for support purposes.
 *
 * Registered globally (see app.module.ts) so it always runs before RolesGuard — routes
 * that must be reachable without a token (login, register, health checks) opt out via @Public().
 */
@Injectable()
export class HotelScopeGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

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
      request.employeeId = payload.employeeId;

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
