import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BonusDeduction } from '../../models/bonus-deduction.entity';
import { CreateBonusDeductionDto } from './dto/create-bonus-deduction.dto';
import { UpdateBonusDeductionDto } from './dto/update-bonus-deduction.dto';

@Injectable()
export class BonusDeductionService {
  constructor(
    @InjectRepository(BonusDeduction)
    private readonly repo: Repository<BonusDeduction>,
  ) {}

  create(hotelId: string, dto: CreateBonusDeductionDto) {
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
      throw new NotFoundException(`BonusDeduction ${id} not found`);
    }
    return record;
  }

  async update(id: string, hotelId: string, dto: UpdateBonusDeductionDto) {
    const record = await this.findOne(id, hotelId);
    Object.assign(record, dto);
    return this.repo.save(record);
  }

  async remove(id: string, hotelId: string) {
    const record = await this.findOne(id, hotelId);
    return this.repo.remove(record);
  }
}
