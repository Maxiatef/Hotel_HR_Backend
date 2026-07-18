import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Advance } from '../../models/advance.entity';
import { CreateAdvanceDto } from './dto/create-advance.dto';
import { UpdateAdvanceDto } from './dto/update-advance.dto';

@Injectable()
export class AdvanceService {
  constructor(
    @InjectRepository(Advance)
    private readonly repo: Repository<Advance>,
  ) {}

  create(hotelId: string, dto: CreateAdvanceDto) {
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
      throw new NotFoundException(`Advance ${id} not found`);
    }
    return record;
  }

  async update(id: string, hotelId: string, dto: UpdateAdvanceDto) {
    const record = await this.findOne(id, hotelId);
    Object.assign(record, dto);
    return this.repo.save(record);
  }

  async approve(id: string, hotelId: string) {
    const record = await this.findOne(id, hotelId);
    record.status = 'approved';
    return this.repo.save(record);
  }

  async reject(id: string, hotelId: string) {
    const record = await this.findOne(id, hotelId);
    record.status = 'rejected';
    return this.repo.save(record);
  }

  async remove(id: string, hotelId: string) {
    const record = await this.findOne(id, hotelId);
    return this.repo.remove(record);
  }
}
