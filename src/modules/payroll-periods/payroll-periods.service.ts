import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PayrollPeriod } from '../../models/payroll-period.entity';
import { CreatePayrollPeriodDto } from './dto/create-payroll-period.dto';
import { UpdatePayrollPeriodDto } from './dto/update-payroll-period.dto';

@Injectable()
export class PayrollPeriodService {
  constructor(
    @InjectRepository(PayrollPeriod)
    private readonly repo: Repository<PayrollPeriod>,
  ) {}

  create(hotelId: string, dto: CreatePayrollPeriodDto) {
    const entity = this.repo.create({ ...(dto as any), hotelId });
    return this.repo.save(entity);
  }

  findAll(hotelId: string) {
    return this.repo.find({ where: { hotelId } as any });
  }

  async findOne(id: string, hotelId: string) {
    const record = await this.repo.findOne({ where: { id, hotelId } as any });
    if (!record) {
      throw new NotFoundException(`PayrollPeriod ${id} not found`);
    }
    return record;
  }

  async update(id: string, hotelId: string, dto: UpdatePayrollPeriodDto) {
    const record = await this.findOne(id, hotelId);
    Object.assign(record, dto);
    return this.repo.save(record);
  }

  async remove(id: string, hotelId: string) {
    const record = await this.findOne(id, hotelId);
    return this.repo.remove(record);
  }
}
