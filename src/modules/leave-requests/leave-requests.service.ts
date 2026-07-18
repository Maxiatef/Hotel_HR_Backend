import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveRequest } from '../../models/leave-request.entity';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { UpdateLeaveRequestDto } from './dto/update-leave-request.dto';

@Injectable()
export class LeaveRequestService {
  constructor(
    @InjectRepository(LeaveRequest)
    private readonly repo: Repository<LeaveRequest>,
  ) {}

  create(hotelId: string, dto: CreateLeaveRequestDto) {
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

  async findMine(hotelId: string, employeeId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await this.repo.findAndCount({
      where: { hotelId, employeeId } as any,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async findOne(id: string, hotelId: string) {
    const record = await this.repo.findOne({ where: { id, hotelId } as any });
    if (!record) {
      throw new NotFoundException(`LeaveRequest ${id} not found`);
    }
    return record;
  }

  async update(id: string, hotelId: string, dto: UpdateLeaveRequestDto) {
    const record = await this.findOne(id, hotelId);
    Object.assign(record, dto);
    return this.repo.save(record);
  }

  async approve(id: string, hotelId: string) {
    const record = await this.findOne(id, hotelId);
    record.status = 'approved';
    return this.repo.save(record);
  }

  async reject(id: string, hotelId: string, dto: { reason?: string }) {
    const record = await this.findOne(id, hotelId);
    record.status = 'rejected';
    if (dto.reason) {
      record.reason = dto.reason;
    }
    return this.repo.save(record);
  }

  async remove(id: string, hotelId: string) {
    const record = await this.findOne(id, hotelId);
    return this.repo.remove(record);
  }
}
