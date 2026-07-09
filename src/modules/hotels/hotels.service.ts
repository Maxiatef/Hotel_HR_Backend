import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hotel } from '../../models/hotel.entity';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';

@Injectable()
export class HotelService {
  constructor(
    @InjectRepository(Hotel)
    private readonly repo: Repository<Hotel>,
  ) {}

  create(dto: CreateHotelDto) {
    const entity = this.repo.create(dto as any);
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find({ where: {} });
  }

  async findOne(id: string) {
    const record = await this.repo.findOne({ where: { id } as any });
    if (!record) {
      throw new NotFoundException(`Hotel ${id} not found`);
    }
    return record;
  }

  async update(id: string, dto: UpdateHotelDto) {
    const record = await this.findOne(id);
    Object.assign(record, dto);
    return this.repo.save(record);
  }

  async remove(id: string) {
    const record = await this.findOne(id);
    return this.repo.remove(record);
  }
}
