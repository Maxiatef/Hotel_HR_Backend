import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from '../../models/employee.entity';
import { Hotel } from '../../models/hotel.entity';
import { EmployeeController } from './employees.controller';
import { EmployeeService } from './employees.service';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Hotel])],
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [EmployeeService],
})
export class EmployeeModule {}
