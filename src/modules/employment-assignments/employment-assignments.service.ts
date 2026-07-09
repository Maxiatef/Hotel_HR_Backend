import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmploymentAssignment } from '../../models/employment-assignment.entity';
import { CreateEmploymentAssignmentDto } from './dto/create-employment-assignment.dto';
import { UpdateEmploymentAssignmentDto } from './dto/update-employment-assignment.dto';

@Injectable()
export class EmploymentAssignmentService {
  constructor(
    @InjectRepository(EmploymentAssignment)
    private readonly repo: Repository<EmploymentAssignment>,
  ) {}

  create(hotelId: string, dto: CreateEmploymentAssignmentDto) {
    const entity = this.repo.create({ ...(dto as any), hotelId });
    return this.repo.save(entity);
  }

  findAll(hotelId: string) {
    return this.repo.find({ where: { hotelId } as any });
  }

  async findOne(id: string, hotelId: string) {
    const record = await this.repo.findOne({ where: { id, hotelId } as any });
    if (!record) {
      throw new NotFoundException(`EmploymentAssignment ${id} not found`);
    }
    return record;
  }

  async update(id: string, hotelId: string, dto: UpdateEmploymentAssignmentDto) {
    const record = await this.findOne(id, hotelId);
    Object.assign(record, dto);
    return this.repo.save(record);
  }

  async remove(id: string, hotelId: string) {
    const record = await this.findOne(id, hotelId);
    return this.repo.remove(record);
  }
}
