import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmploymentAssignment } from '../../models/employment-assignment.entity';
import { EmploymentAssignmentController } from './employment-assignments.controller';
import { EmploymentAssignmentService } from './employment-assignments.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmploymentAssignment])],
  controllers: [EmploymentAssignmentController],
  providers: [EmploymentAssignmentService],
  exports: [EmploymentAssignmentService],
})
export class EmploymentAssignmentModule {}
