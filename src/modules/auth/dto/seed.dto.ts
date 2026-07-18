import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SeedDto {
  @ApiProperty({ example: 'Grand Nile Hotel', description: 'Name of the first hotel' })
  @IsString()
  @IsNotEmpty()
  hotelName: string;

  @ApiProperty({ example: 'HTL-001', description: 'Unique hotel code' })
  @IsString()
  @IsNotEmpty()
  hotelCode: string;

  @ApiProperty({ example: 'admin', description: 'Super admin username' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'admin@hotel.com', description: 'Super admin email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'admin123', description: 'Password (min 8 characters)', minLength: 8, default: 'admin123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
