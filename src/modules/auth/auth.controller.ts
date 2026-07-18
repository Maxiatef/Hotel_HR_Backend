import { Body, Controller, Post, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SeedDto } from './dto/seed.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login', description: 'Authenticate with username and password, returns a JWT token' })
  @ApiResponse({ status: 200, description: 'Login successful — returns JWT token and user info' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user', description: 'Create a new user account linked to a hotel' })
  @ApiResponse({ status: 201, description: 'User registered successfully — returns JWT token' })
  @ApiResponse({ status: 400, description: 'Validation error or duplicate username/email' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('seed')
  @ApiOperation({ summary: 'Bootstrap first hotel + super_admin', description: 'One-time setup. Fails if any user already exists.' })
  @ApiResponse({ status: 201, description: 'Returns JWT token, user, and hotel' })
  @ApiResponse({ status: 400, description: 'Already seeded' })
  seed(@Body() dto: SeedDto) {
    return this.authService.seed(dto.hotelName, dto.hotelCode, dto.username, dto.email, dto.password);
  }

  @Post('change-password')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Change password', description: 'Change the authenticated user\'s password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized or wrong old password' })
  changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(req.userId, dto);
  }
}
