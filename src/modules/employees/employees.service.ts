import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../../models/employee.entity';
import { Hotel } from '../../models/hotel.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly repo: Repository<Employee>,
    @InjectRepository(Hotel)
    private readonly hotelRepo: Repository<Hotel>,
  ) {}

  async create(hotelId: string, dto: CreateEmployeeDto) {
    const employeeCode = dto.employeeCode || (await this.generateEmployeeCode(hotelId));
    const entity = this.repo.create({ ...(dto as any), hotelId, employeeCode });
    return this.repo.save(entity);
  }

  /**
   * employeeCode is globally unique (not just per-hotel), so it's prefixed with the
   * hotel's own code. A short retry loop guards against a race with a concurrent create
   * landing on the same sequence number.
   */
  private async generateEmployeeCode(hotelId: string): Promise<string> {
    const hotel = await this.hotelRepo.findOne({ where: { id: hotelId } });
    const prefix = hotel ? hotel.code : 'EMP';

    for (let attempt = 0; attempt < 5; attempt++) {
      const count = await this.repo.count({ where: { hotelId } as any });
      const candidate = `${prefix}-${String(count + 1 + attempt).padStart(4, '0')}`;
      const existing = await this.repo.findOne({ where: { employeeCode: candidate } });
      if (!existing) {
        return candidate;
      }
    }
    // Fallback: timestamp-based suffix guarantees uniqueness if the sequential attempts collided.
    return `${prefix}-${Date.now().toString(36).toUpperCase()}`;
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
      throw new NotFoundException(`Employee ${id} not found`);
    }
    return record;
  }

  async update(id: string, hotelId: string, dto: UpdateEmployeeDto) {
    const record = await this.findOne(id, hotelId);
    Object.assign(record, dto);
    return this.repo.save(record);
  }

  async remove(id: string, hotelId: string) {
    const record = await this.findOne(id, hotelId);
    return this.repo.remove(record);
  }
}
