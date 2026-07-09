import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeBankAccount } from '../../models/employee-bank-account.entity';
import { CreateEmployeeBankAccountDto } from './dto/create-employee-bank-account.dto';
import { UpdateEmployeeBankAccountDto } from './dto/update-employee-bank-account.dto';

@Injectable()
export class EmployeeBankAccountService {
  constructor(
    @InjectRepository(EmployeeBankAccount)
    private readonly repo: Repository<EmployeeBankAccount>,
  ) {}

  create(dto: CreateEmployeeBankAccountDto) {
    const entity = this.repo.create(dto as any);
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find({ where: {} });
  }

  async findOne(id: string) {
    const record = await this.repo.findOne({ where: { id } as any });
    if (!record) {
      throw new NotFoundException(`EmployeeBankAccount ${id} not found`);
    }
    return record;
  }

  async update(id: string, dto: UpdateEmployeeBankAccountDto) {
    const record = await this.findOne(id);
    Object.assign(record, dto);
    return this.repo.save(record);
  }

  async remove(id: string) {
    const record = await this.findOne(id);
    return this.repo.remove(record);
  }
}
