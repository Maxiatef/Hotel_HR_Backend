import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmploymentAssignment } from '../../models/employment-assignment.entity';
import { Employee } from '../../models/employee.entity';
import { CreateEmploymentAssignmentDto } from './dto/create-employment-assignment.dto';
import { UpdateEmploymentAssignmentDto } from './dto/update-employment-assignment.dto';
import { TransferEmployeeDto } from './dto/transfer-employee.dto';

@Injectable()
export class EmploymentAssignmentService {
  constructor(
    @InjectRepository(EmploymentAssignment)
    private readonly repo: Repository<EmploymentAssignment>,
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
  ) {}

  create(hotelId: string, dto: CreateEmploymentAssignmentDto) {
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
      throw new NotFoundException(`EmploymentAssignment ${id} not found`);
    }
    return record;
  }

  async update(id: string, hotelId: string, dto: UpdateEmploymentAssignmentDto) {
    const record = await this.findOne(id, hotelId);
    Object.assign(record, dto);
    return this.repo.save(record);
  }

  async remove(id: string, hotelId: string) {
    const record = await this.findOne(id, hotelId);
    return this.repo.remove(record);
  }

  async transfer(dto: TransferEmployeeDto) {
    const employee = await this.employeeRepo.findOne({ where: { id: dto.employeeId } });
    if (!employee) {
      throw new NotFoundException(`Employee ${dto.employeeId} not found`);
    }

    const activeAssignment = await this.repo.findOne({
      where: {
        employeeId: dto.employeeId,
        hotelId: dto.fromHotelId,
        endDate: null,
      } as any,
    });

    if (activeAssignment) {
      activeAssignment.endDate = new Date();
      await this.repo.save(activeAssignment);
    }

    const newAssignment = this.repo.create({
      employeeId: dto.employeeId,
      hotelId: dto.toHotelId,
      departmentId: dto.toDepartmentId,
      startDate: new Date(),
      employmentType: dto.employmentType,
      workStatus: dto.workStatus,
      transferReason: dto.transferReason,
    });
    const saved = await this.repo.save(newAssignment);

    employee.hotelId = dto.toHotelId;
    if (dto.toDepartmentId) {
      employee.departmentId = dto.toDepartmentId;
    }
    if (dto.employmentType) {
      employee.employmentType = dto.employmentType;
    }
    if (dto.workStatus) {
      employee.workStatus = dto.workStatus;
    }
    await this.employeeRepo.save(employee);

    return saved;
  }
}
