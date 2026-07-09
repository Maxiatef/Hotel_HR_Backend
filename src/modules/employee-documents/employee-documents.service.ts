import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeDocument } from '../../models/employee-document.entity';
import { CreateEmployeeDocumentDto } from './dto/create-employee-document.dto';
import { UpdateEmployeeDocumentDto } from './dto/update-employee-document.dto';

@Injectable()
export class EmployeeDocumentService {
  constructor(
    @InjectRepository(EmployeeDocument)
    private readonly repo: Repository<EmployeeDocument>,
  ) {}

  create(dto: CreateEmployeeDocumentDto) {
    const entity = this.repo.create(dto as any);
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find({ where: {} });
  }

  async findOne(id: string) {
    const record = await this.repo.findOne({ where: { id } as any });
    if (!record) {
      throw new NotFoundException(`EmployeeDocument ${id} not found`);
    }
    return record;
  }

  async update(id: string, dto: UpdateEmployeeDocumentDto) {
    const record = await this.findOne(id);
    Object.assign(record, dto);
    return this.repo.save(record);
  }

  async remove(id: string) {
    const record = await this.findOne(id);
    return this.repo.remove(record);
  }
}
