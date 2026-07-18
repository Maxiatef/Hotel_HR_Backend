import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalaryHistory } from '../../models/salary-history.entity';
import { CreateSalaryHistoryDto } from './dto/create-salary-history.dto';
import { UpdateSalaryHistoryDto } from './dto/update-salary-history.dto';

@Injectable()
export class SalaryHistoryService {
  constructor(
    @InjectRepository(SalaryHistory)
    private readonly repo: Repository<SalaryHistory>,
  ) {}

  create(hotelId: string, dto: CreateSalaryHistoryDto) {
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
      throw new NotFoundException(`SalaryHistory ${id} not found`);
    }
    return record;
  }

  async update(id: string, hotelId: string, dto: UpdateSalaryHistoryDto) {
    const record = await this.findOne(id, hotelId);
    Object.assign(record, dto);
    return this.repo.save(record);
  }

  async remove(id: string, hotelId: string) {
    const record = await this.findOne(id, hotelId);
    return this.repo.remove(record);
  }
}
