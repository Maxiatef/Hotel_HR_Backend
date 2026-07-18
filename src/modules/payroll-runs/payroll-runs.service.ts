import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PayrollRun } from '../../models/payroll-run.entity';
import { CreatePayrollRunDto } from './dto/create-payroll-run.dto';
import { UpdatePayrollRunDto } from './dto/update-payroll-run.dto';

@Injectable()
export class PayrollRunService {
  constructor(
    @InjectRepository(PayrollRun)
    private readonly repo: Repository<PayrollRun>,
  ) {}

  create(hotelId: string, dto: CreatePayrollRunDto) {
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
      throw new NotFoundException(`PayrollRun ${id} not found`);
    }
    return record;
  }

  async update(id: string, hotelId: string, dto: UpdatePayrollRunDto) {
    const record = await this.findOne(id, hotelId);
    Object.assign(record, dto);
    return this.repo.save(record);
  }

  async remove(id: string, hotelId: string) {
    const record = await this.findOne(id, hotelId);
    return this.repo.remove(record);
  }
}
