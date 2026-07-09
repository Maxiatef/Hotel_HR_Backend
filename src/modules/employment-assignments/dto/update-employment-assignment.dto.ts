import { PartialType } from '@nestjs/mapped-types';
import { CreateEmploymentAssignmentDto } from './create-employment-assignment.dto';

export class UpdateEmploymentAssignmentDto extends PartialType(CreateEmploymentAssignmentDto) {}
