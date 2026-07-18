import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../models/user.entity';
import { Hotel } from '../../models/hotel.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Hotel)
    private readonly hotelRepo: Repository<Hotel>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { username: dto.username },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    user.lastLoginAt = new Date();
    await this.userRepo.save(user);

    const payload = {
      sub: user.id,
      hotelId: user.hotelId,
      role: user.role,
      employeeId: user.employeeId,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        hotelId: user.hotelId,
        employeeId: user.employeeId,
      },
    };
  }

  async register(dto: RegisterDto) {
    const hotel = await this.hotelRepo.findOne({
      where: { id: dto.hotelId },
    });
    if (!hotel) {
      throw new BadRequestException('Hotel not found');
    }

    const existingUsername = await this.userRepo.findOne({
      where: { username: dto.username },
    });
    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    const existingEmail = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = this.userRepo.create({
      hotelId: dto.hotelId,
      username: dto.username,
      email: dto.email,
      passwordHash,
      role: dto.role || 'employee',
      employeeId: dto.employeeId,
    });

    const saved = await this.userRepo.save(user);

    const payload = {
      sub: saved.id,
      hotelId: saved.hotelId,
      role: saved.role,
      employeeId: saved.employeeId,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: saved.id,
        username: saved.username,
        email: saved.email,
        role: saved.role,
        hotelId: saved.hotelId,
        employeeId: saved.employeeId,
      },
    };
  }

  async seed(hotelName: string, hotelCode: string, username: string, email: string, password: string) {
    const userCount = await this.userRepo.count();
    if (userCount > 0) {
      throw new BadRequestException('Seed is only allowed when no users exist');
    }

    const hotel = this.hotelRepo.create({ code: hotelCode, name: hotelName, isActive: true });
    const savedHotel = await this.hotelRepo.save(hotel);

    const passwordHash = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({
      hotelId: savedHotel.id,
      username,
      email,
      passwordHash,
      role: 'super_admin',
    });
    const savedUser = await this.userRepo.save(user);

    const payload = { sub: savedUser.id, hotelId: savedUser.hotelId, role: savedUser.role };
    return {
      accessToken: this.jwtService.sign(payload),
      user: { id: savedUser.id, username: savedUser.username, email: savedUser.email, role: savedUser.role, hotelId: savedUser.hotelId },
      hotel: { id: savedHotel.id, code: savedHotel.code, name: savedHotel.name },
    };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const passwordValid = await bcrypt.compare(dto.oldPassword, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    user.passwordHash = await bcrypt.hash(dto.newPassword, 10);
    await this.userRepo.save(user);

    return { message: 'Password changed successfully' };
  }
}
