import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PayrollPeriod } from '../../models/payroll-period.entity';
import { PayrollRun } from '../../models/payroll-run.entity';
import { PayrollItem } from '../../models/payroll-item.entity';
import { CreatePayrollPeriodDto } from './dto/create-payroll-period.dto';
import { UpdatePayrollPeriodDto } from './dto/update-payroll-period.dto';

@Injectable()
export class PayrollPeriodService {
  constructor(
    @InjectRepository(PayrollPeriod)
    private readonly repo: Repository<PayrollPeriod>,
    @InjectRepository(PayrollRun)
    private readonly runRepo: Repository<PayrollRun>,
    @InjectRepository(PayrollItem)
    private readonly itemRepo: Repository<PayrollItem>,
  ) {}

  async create(hotelId: string, dto: CreatePayrollPeriodDto) {
    // Check if there's already an open period for this hotel
    if (dto.status === 'open') {
      const existingOpen = await this.repo.findOne({
        where: { hotelId, status: 'open' } as any,
      });
      if (existingOpen) {
        throw new ConflictException(
          `An open payroll period already exists for this hotel (ID: ${existingOpen.id})`,
        );
      }
    }
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
      throw new NotFoundException(`PayrollPeriod ${id} not found`);
    }
    return record;
  }

  async update(id: string, hotelId: string, dto: UpdatePayrollPeriodDto) {
    const record = await this.findOne(id, hotelId);

    // Prevent direct status changes through update - use close/open endpoints instead
    if (dto.status && dto.status !== record.status) {
      throw new BadRequestException(
        'Cannot change status directly. Use /close or /open endpoints instead.',
      );
    }

    Object.assign(record, dto);
    return this.repo.save(record);
  }

  async close(id: string, hotelId: string) {
    const record = await this.findOne(id, hotelId);

    if (record.status === 'closed') {
      throw new BadRequestException('Payroll period is already closed');
    }

    if (record.status === 'locked') {
      throw new BadRequestException('Cannot close a locked payroll period');
    }

    record.status = 'closed';
    return this.repo.save(record);
  }

  async open(id: string, hotelId: string) {
    const record = await this.findOne(id, hotelId);

    if (record.status === 'open') {
      throw new BadRequestException('Payroll period is already open');
    }

    if (record.status === 'locked') {
      throw new BadRequestException('Cannot open a locked payroll period');
    }

    // Check if there's already an open period for this hotel
    const existingOpen = await this.repo.findOne({
      where: { hotelId, status: 'open' } as any,
    });
    if (existingOpen) {
      throw new ConflictException(
        `An open payroll period already exists for this hotel (ID: ${existingOpen.id})`,
      );
    }

    record.status = 'open';
    return this.repo.save(record);
  }

  async remove(id: string, hotelId: string) {
    const record = await this.findOne(id, hotelId);

    if (record.status === 'closed') {
      throw new BadRequestException('Cannot delete a closed payroll period');
    }

    // Cascade: delete all items then runs linked to this period
    const runs = await this.runRepo.find({ where: { payrollPeriodId: id } as any });
    for (const run of runs) {
      await this.itemRepo.delete({ payrollRunId: run.id } as any);
    }
    if (runs.length > 0) {
      await this.runRepo.delete({ payrollPeriodId: id } as any);
    }

    return this.repo.remove(record);
  }
}
