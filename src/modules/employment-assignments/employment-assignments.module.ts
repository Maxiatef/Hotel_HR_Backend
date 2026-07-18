import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmploymentAssignment } from '../../models/employment-assignment.entity';
import { Employee } from '../../models/employee.entity';
import { EmploymentAssignmentController } from './employment-assignments.controller';
import { EmploymentAssignmentService } from './employment-assignments.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmploymentAssignment, Employee])],
  controllers: [EmploymentAssignmentController],
  providers: [EmploymentAssignmentService],
  exports: [EmploymentAssignmentService],
})
export class EmploymentAssignmentModule {}
