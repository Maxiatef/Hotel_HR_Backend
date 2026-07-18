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

  create(hotelId: string, dto: CreateEmployeeBankAccountDto) {
    const entity = this.repo.create({ ...(dto as any), hotelId });
    return this.repo.save(entity);
  }

  async findAll(hotelId: string, page = 1, limit = 25, sortBy?: string, sortOrder: 'ASC' | 'DESC' = 'ASC') {
    const skip = (page - 1) * limit;
    const order = sortBy ? { [sortBy]: sortOrder } : {};
    const [data, total] = await this.repo.findAndCount({
      where: { hotelId } as any,
      skip,
      take: limit,
      order,
    });
    return { data, total, page, limit };
  }

  async findOne(id: string, hotelId: string) {
    const record = await this.repo.findOne({ where: { id, hotelId } as any });
    if (!record) {
      throw new NotFoundException(`EmployeeBankAccount ${id} not found`);
    }
    return record;
  }

  async update(id: string, hotelId: string, dto: UpdateEmployeeBankAccountDto) {
    const record = await this.findOne(id, hotelId);
    Object.assign(record, dto);
    return this.repo.save(record);
  }

  async remove(id: string, hotelId: string) {
    const record = await this.findOne(id, hotelId);
    return this.repo.remove(record);
  }
}
