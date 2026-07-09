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
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        hotelId: user.hotelId,
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
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: saved.id,
        username: saved.username,
        email: saved.email,
        role: saved.role,
        hotelId: saved.hotelId,
      },
    };
  }
}
