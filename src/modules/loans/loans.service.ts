import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan } from '../../models/loan.entity';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';

@Injectable()
export class LoanService {
  constructor(
    @InjectRepository(Loan)
    private readonly repo: Repository<Loan>,
  ) {}

  create(hotelId: string, dto: CreateLoanDto) {
    if (dto.remainingAmount !== dto.principalAmount) {
      throw new BadRequestException('remainingAmount must equal principalAmount on creation');
    }

    const monthlyInstallment = dto.monthlyInstallment ?? dto.principalAmount / 12;

    const entity = this.repo.create({
      ...(dto as any),
      hotelId,
      monthlyInstallment,
    });
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
      throw new NotFoundException(`Loan ${id} not found`);
    }
    return record;
  }

  async update(id: string, hotelId: string, dto: UpdateLoanDto) {
    const record = await this.findOne(id, hotelId);
    Object.assign(record, dto);
    return this.repo.save(record);
  }

  async remove(id: string, hotelId: string) {
    const record = await this.findOne(id, hotelId);
    return this.repo.remove(record);
  }
}
