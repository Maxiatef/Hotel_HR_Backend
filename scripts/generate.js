/**
 * Scaffolds a TypeORM entity + full CRUD module (controller/service/DTOs) for
 * every entity in the schema. Run with: node scripts/generate.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'src');

// column type shorthand -> TypeORM column config
const T = {
  uuid: `@PrimaryGeneratedColumn('uuid')`,
  str: (opts = '') => `@Column({ type: 'varchar'${opts} })`,
  strNull: (opts = '') => `@Column({ type: 'varchar', nullable: true${opts} })`,
  text: `@Column({ type: 'text', nullable: true })`,
  decimal: (p = 12, s = 2, def) =>
    `@Column({ type: 'decimal', precision: ${p}, scale: ${s}${def !== undefined ? `, default: ${def}` : ''} })`,
  decimalNull: (p = 12, s = 2) =>
    `@Column({ type: 'decimal', precision: ${p}, scale: ${s}, nullable: true })`,
  int: `@Column({ type: 'int' })`,
  bool: (def = true) => `@Column({ type: 'boolean', default: ${def} })`,
  date: `@Column({ type: 'date' })`,
  dateNull: `@Column({ type: 'date', nullable: true })`,
  timestamp: `@Column({ type: 'timestamp', nullable: true })`,
  timestampNow: `@CreateDateColumn()`,
  timestampUpdate: `@UpdateDateColumn()`,
};

// Each entity: name, table, route, hotelScoped, columns[] (name, decoratorLine, tsType)
const entities = [
  {
    className: 'Hotel', table: 'hotels', route: 'hotels', hotelScoped: false,
    columns: [
      ['id', T.uuid, 'string'],
      ['code', T.str(", unique: true"), 'string'],
      ['name', T.str(), 'string'],
      ['city', T.strNull(), 'string'],
      ['isActive', T.bool(true), 'boolean'],
      ['createdAt', T.timestampNow, 'Date'],
    ],
  },
  {
    className: 'User', table: 'users', route: 'users', hotelScoped: true,
    columns: [
      ['id', T.uuid, 'string'],
      ['hotelId', T.str(), 'string'],
      ['employeeId', T.strNull(", unique: true"), 'string'],
      ['role', T.str(", default: 'hr'"), 'string'],
      ['username', T.str(", unique: true"), 'string'],
      ['email', T.str(", unique: true"), 'string'],
      ['passwordHash', T.str(), 'string'],
      ['isActive', T.bool(true), 'boolean'],
      ['lastLoginAt', T.timestamp, 'Date'],
      ['createdAt', T.timestampNow, 'Date'],
    ],
  },
  {
    className: 'Department', table: 'departments', route: 'departments', hotelScoped: true,
    columns: [
      ['id', T.uuid, 'string'],
      ['hotelId', T.str(), 'string'],
      ['name', T.str(), 'string'],
      ['isActive', T.bool(true), 'boolean'],
      ['createdAt', T.timestampNow, 'Date'],
    ],
  },
  {
    className: 'Employee', table: 'employees', route: 'employees', hotelScoped: true,
    columns: [
      ['id', T.uuid, 'string'],
      ['employeeCode', T.str(", unique: true"), 'string'],
      ['hotelId', T.str(), 'string'],
      ['departmentId', T.strNull(), 'string'],
      ['employmentType', T.strNull(), 'string'],
      ['workStatus', T.str(", default: 'active'"), 'string'],
      ['firstName', T.str(), 'string'],
      ['middleName', T.strNull(), 'string'],
      ['lastName', T.str(), 'string'],
      ['birthDate', T.dateNull, 'Date'],
      ['gender', T.strNull(), 'string'],
      ['nationality', T.strNull(), 'string'],
      ['nationalId', T.strNull(), 'string'],
      ['maritalStatus', T.strNull(), 'string'],
      ['phone', T.strNull(), 'string'],
      ['email', T.strNull(), 'string'],
      ['address', T.text, 'string'],
      ['position', T.strNull(), 'string'],
      ['emergencyContactName', T.strNull(), 'string'],
      ['emergencyContactPhone', T.strNull(), 'string'],
      ['isActive', T.bool(true), 'boolean'],
      ['createdAt', T.timestampNow, 'Date'],
      ['updatedAt', T.timestampUpdate, 'Date'],
    ],
  },
  {
    className: 'EmploymentAssignment', table: 'employment_assignments', route: 'employment-assignments', hotelScoped: true,
    columns: [
      ['id', T.uuid, 'string'],
      ['employeeId', T.str(), 'string'],
      ['hotelId', T.str(), 'string'],
      ['departmentId', T.strNull(), 'string'],
      ['startDate', T.date, 'Date'],
      ['endDate', T.dateNull, 'Date'],
      ['employmentType', T.strNull(), 'string'],
      ['workStatus', T.strNull(), 'string'],
      ['transferReason', T.text, 'string'],
      ['createdAt', T.timestampNow, 'Date'],
    ],
  },
  {
    className: 'SalaryHistory', table: 'salary_history', route: 'salary-history', hotelScoped: true,
    columns: [
      ['id', T.uuid, 'string'],
      ['employeeId', T.str(), 'string'],
      ['hotelId', T.str(), 'string'],
      ['baseSalary', T.decimal(12, 2), 'number'],
      ['housingAllowance', T.decimal(12, 2, 0), 'number'],
      ['transportationAllowance', T.decimal(12, 2, 0), 'number'],
      ['otherFixedAllowance', T.decimal(12, 2, 0), 'number'],
      ['effectiveFrom', T.date, 'Date'],
      ['effectiveTo', T.dateNull, 'Date'],
      ['createdBy', T.strNull(), 'string'],
      ['createdAt', T.timestampNow, 'Date'],
    ],
  },
  {
    className: 'BonusDeduction', table: 'bonus_deductions', route: 'bonus-deductions', hotelScoped: true,
    columns: [
      ['id', T.uuid, 'string'],
      ['employeeId', T.str(), 'string'],
      ['hotelId', T.str(), 'string'],
      ['payrollPeriodId', T.strNull(), 'string'],
      ['type', T.str(), 'string'],
      ['reason', T.text, 'string'],
      ['amount', T.decimal(12, 2), 'number'],
      ['status', T.str(", default: 'approved'"), 'string'],
      ['createdBy', T.strNull(), 'string'],
      ['createdAt', T.timestampNow, 'Date'],
    ],
  },
  {
    className: 'AttendanceRecord', table: 'attendance_records', route: 'attendance-records', hotelScoped: true,
    columns: [
      ['id', T.uuid, 'string'],
      ['employeeId', T.str(), 'string'],
      ['hotelId', T.str(), 'string'],
      ['workDate', T.date, 'Date'],
      ['checkIn', T.timestamp, 'Date'],
      ['checkOut', T.timestamp, 'Date'],
      ['overtimeHours', T.decimal(5, 2, 0), 'number'],
      ['status', T.str(", default: 'present'"), 'string'],
    ],
  },
  {
    className: 'LeaveRequest', table: 'leave_requests', route: 'leave-requests', hotelScoped: true,
    columns: [
      ['id', T.uuid, 'string'],
      ['employeeId', T.str(), 'string'],
      ['hotelId', T.str(), 'string'],
      ['leaveType', T.str(), 'string'],
      ['startDate', T.date, 'Date'],
      ['endDate', T.date, 'Date'],
      ['status', T.str(", default: 'pending'"), 'string'],
      ['reason', T.text, 'string'],
      ['createdAt', T.timestampNow, 'Date'],
    ],
  },
  {
    className: 'Loan', table: 'loans', route: 'loans', hotelScoped: true,
    columns: [
      ['id', T.uuid, 'string'],
      ['employeeId', T.str(), 'string'],
      ['hotelId', T.str(), 'string'],
      ['principalAmount', T.decimal(12, 2), 'number'],
      ['remainingAmount', T.decimal(12, 2), 'number'],
      ['monthlyInstallment', T.decimal(12, 2), 'number'],
      ['startDate', T.date, 'Date'],
      ['status', T.str(", default: 'active'"), 'string'],
      ['createdAt', T.timestampNow, 'Date'],
    ],
  },
  {
    className: 'Advance', table: 'advances', route: 'advances', hotelScoped: true,
    columns: [
      ['id', T.uuid, 'string'],
      ['employeeId', T.str(), 'string'],
      ['hotelId', T.str(), 'string'],
      ['amount', T.decimal(12, 2), 'number'],
      ['requestDate', T.date, 'Date'],
      ['status', T.str(", default: 'pending'"), 'string'],
      ['createdAt', T.timestampNow, 'Date'],
    ],
  },
  {
    className: 'PayrollPeriod', table: 'payroll_periods', route: 'payroll-periods', hotelScoped: true,
    columns: [
      ['id', T.uuid, 'string'],
      ['hotelId', T.str(), 'string'],
      ['year', T.int, 'number'],
      ['month', T.int, 'number'],
      ['status', T.str(", default: 'open'"), 'string'],
      ['createdAt', T.timestampNow, 'Date'],
    ],
  },
  {
    className: 'PayrollRun', table: 'payroll_runs', route: 'payroll-runs', hotelScoped: true,
    columns: [
      ['id', T.uuid, 'string'],
      ['hotelId', T.str(), 'string'],
      ['payrollPeriodId', T.str(), 'string'],
      ['createdBy', T.strNull(), 'string'],
      ['runAt', T.timestampNow, 'Date'],
      ['status', T.str(", default: 'draft'"), 'string'],
      ['totalGross', T.decimal(14, 2, 0), 'number'],
      ['totalNet', T.decimal(14, 2, 0), 'number'],
    ],
  },
  {
    className: 'PayrollItem', table: 'payroll_items', route: 'payroll-items', hotelScoped: true,
    columns: [
      ['id', T.uuid, 'string'],
      ['payrollRunId', T.str(), 'string'],
      ['employeeId', T.str(), 'string'],
      ['hotelId', T.str(), 'string'],
      ['baseSalary', T.decimal(12, 2), 'number'],
      ['fixedAllowances', T.decimal(12, 2, 0), 'number'],
      ['bonusTotal', T.decimal(12, 2, 0), 'number'],
      ['deductionTotal', T.decimal(12, 2, 0), 'number'],
      ['overtimeTotal', T.decimal(12, 2, 0), 'number'],
      ['leaveDeductionTotal', T.decimal(12, 2, 0), 'number'],
      ['loanDeductionTotal', T.decimal(12, 2, 0), 'number'],
      ['socialInsuranceTotal', T.decimal(12, 2, 0), 'number'],
      ['taxTotal', T.decimal(12, 2, 0), 'number'],
      ['netSalary', T.decimal(12, 2), 'number'],
      ['createdAt', T.timestampNow, 'Date'],
    ],
  },
  {
    className: 'EmployeeBankAccount', table: 'employee_bank_accounts', route: 'employee-bank-accounts', hotelScoped: false,
    columns: [
      ['id', T.uuid, 'string'],
      ['employeeId', T.str(), 'string'],
      ['bankName', T.str(), 'string'],
      ['accountNumber', T.str(), 'string'],
      ['iban', T.strNull(), 'string'],
      ['isPrimary', T.bool(true), 'boolean'],
    ],
  },
  {
    className: 'EmployeeDocument', table: 'employee_documents', route: 'employee-documents', hotelScoped: false,
    columns: [
      ['id', T.uuid, 'string'],
      ['employeeId', T.str(), 'string'],
      ['documentType', T.str(), 'string'],
      ['fileUrl', T.strNull(), 'string'],
      ['expiryDate', T.dateNull, 'Date'],
    ],
  },
];

function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }
function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content);
  console.log('created', path.relative(ROOT, filePath));
}
function singular(route) { return route.replace(/-/g, '-').replace(/s$/, ''); }

// ---------------- Entity files (src/models) ----------------
function generateEntityFile(entity) {
  const importsNeeded = new Set(['Entity', 'Column']);
  entity.columns.forEach(([, dec]) => {
    if (dec.includes('PrimaryGeneratedColumn')) importsNeeded.add('PrimaryGeneratedColumn');
    if (dec.includes('CreateDateColumn')) importsNeeded.add('CreateDateColumn');
    if (dec.includes('UpdateDateColumn')) importsNeeded.add('UpdateDateColumn');
  });

  const colLines = entity.columns.map(([name, dec, tsType]) => {
    const optional = dec.includes('nullable: true') ? '?' : '';
    return `  ${dec}\n  ${name}${optional}: ${tsType};\n`;
  }).join('\n');

  const content = `import { ${[...importsNeeded].join(', ')} } from 'typeorm';

@Entity('${entity.table}')
export class ${entity.className} {
${colLines}}
`;
  writeFile(path.join(ROOT, 'models', `${singular(entity.route)}.entity.ts`), content);
}

// ---------------- DTOs (generic passthrough — see employees for a fully-typed example) ----------------
function generateDtoFiles(entity) {
  const dtoDir = path.join(ROOT, 'modules', entity.route, 'dto');
  ensureDir(dtoDir);
  const fields = entity.columns.filter(([name]) => !['id', 'createdAt', 'updatedAt'].includes(name) && !(entity.hotelScoped && name === 'hotelId'));

  const createDto = `/**
 * Generic DTO — accepts the entity's writable fields as \`any\`.
 * See src/modules/employees/dto/create-employee.dto.ts for the fully-typed,
 * class-validator version; apply that same pattern here when you're ready.
 */
export class Create${entity.className}Dto {
${fields.map(([name]) => `  ${name}?: any;`).join('\n')}
}
`;
  writeFile(path.join(dtoDir, `create-${singular(entity.route)}.dto.ts`), createDto);

  const updateDto = `import { PartialType } from '@nestjs/mapped-types';
import { Create${entity.className}Dto } from './create-${singular(entity.route)}.dto';

export class Update${entity.className}Dto extends PartialType(Create${entity.className}Dto) {}
`;
  writeFile(path.join(dtoDir, `update-${singular(entity.route)}.dto.ts`), updateDto);
}

// ---------------- Service (TypeORM repository) ----------------
function generateServiceFile(entity) {
  const hotelParam = entity.hotelScoped ? 'hotelId: string' : '';
  const hotelWhere = entity.hotelScoped ? `{ ...(dto as any), hotelId }` : `dto as any`;
  const findAllWhere = entity.hotelScoped ? `{ hotelId } as any` : `{}`;
  const findOneWhere = entity.hotelScoped ? `{ id, hotelId } as any` : `{ id } as any`;

  const content = `import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ${entity.className} } from '../../models/${singular(entity.route)}.entity';
import { Create${entity.className}Dto } from './dto/create-${singular(entity.route)}.dto';
import { Update${entity.className}Dto } from './dto/update-${singular(entity.route)}.dto';

@Injectable()
export class ${entity.className}Service {
  constructor(
    @InjectRepository(${entity.className})
    private readonly repo: Repository<${entity.className}>,
  ) {}

  create(${hotelParam ? hotelParam + ', ' : ''}dto: Create${entity.className}Dto) {
    const entity = this.repo.create(${hotelWhere});
    return this.repo.save(entity);
  }

  findAll(${hotelParam}) {
    return this.repo.find({ where: ${findAllWhere} });
  }

  async findOne(id: string${hotelParam ? ', ' + hotelParam : ''}) {
    const record = await this.repo.findOne({ where: ${findOneWhere} });
    if (!record) {
      throw new NotFoundException(\`${entity.className} \${id} not found\`);
    }
    return record;
  }

  async update(id: string${hotelParam ? ', ' + hotelParam : ''}, dto: Update${entity.className}Dto) {
    const record = await this.findOne(id${entity.hotelScoped ? ', hotelId' : ''});
    Object.assign(record, dto);
    return this.repo.save(record);
  }

  async remove(id: string${hotelParam ? ', ' + hotelParam : ''}) {
    const record = await this.findOne(id${entity.hotelScoped ? ', hotelId' : ''});
    return this.repo.remove(record);
  }
}
`;
  writeFile(path.join(ROOT, 'modules', entity.route, `${entity.route}.service.ts`), content);
}

// ---------------- Controller ----------------
function generateControllerFile(entity) {
  const hotelDecoratorImport = entity.hotelScoped
    ? `import { CurrentHotel } from '../../common/decorators/current-hotel.decorator';\n`
    : '';
  const hotelParamSig = entity.hotelScoped ? `@CurrentHotel() hotelId: string` : '';
  const hotelArg = entity.hotelScoped ? 'hotelId' : '';

  const content = `import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
${hotelDecoratorImport}import { ${entity.className}Service } from './${entity.route}.service';
import { Create${entity.className}Dto } from './dto/create-${singular(entity.route)}.dto';
import { Update${entity.className}Dto } from './dto/update-${singular(entity.route)}.dto';

@Controller('${entity.route}')
// @UseGuards(HotelScopeGuard) // enable once the auth module issues JWTs with hotelId
export class ${entity.className}Controller {
  constructor(private readonly service: ${entity.className}Service) {}

  @Post()
  create(${hotelParamSig ? hotelParamSig + ', ' : ''}@Body() dto: Create${entity.className}Dto) {
    return this.service.create(${hotelArg ? hotelArg + ', ' : ''}dto);
  }

  @Get()
  findAll(${hotelParamSig}) {
    return this.service.findAll(${hotelArg});
  }

  @Get(':id')
  findOne(@Param('id') id: string${hotelParamSig ? ', ' + hotelParamSig : ''}) {
    return this.service.findOne(id${hotelArg ? ', ' + hotelArg : ''});
  }

  @Patch(':id')
  update(@Param('id') id: string${hotelParamSig ? ', ' + hotelParamSig : ''}, @Body() dto: Update${entity.className}Dto) {
    return this.service.update(id${hotelArg ? ', ' + hotelArg : ''}, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string${hotelParamSig ? ', ' + hotelParamSig : ''}) {
    return this.service.remove(id${hotelArg ? ', ' + hotelArg : ''});
  }
}
`;
  writeFile(path.join(ROOT, 'modules', entity.route, `${entity.route}.controller.ts`), content);
}

// ---------------- Module ----------------
function generateModuleFile(entity) {
  const content = `import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ${entity.className} } from '../../models/${singular(entity.route)}.entity';
import { ${entity.className}Controller } from './${entity.route}.controller';
import { ${entity.className}Service } from './${entity.route}.service';

@Module({
  imports: [TypeOrmModule.forFeature([${entity.className}])],
  controllers: [${entity.className}Controller],
  providers: [${entity.className}Service],
  exports: [${entity.className}Service],
})
export class ${entity.className}Module {}
`;
  writeFile(path.join(ROOT, 'modules', entity.route, `${entity.route}.module.ts`), content);
}

// ---------------- Run ----------------
ensureDir(path.join(ROOT, 'models'));
for (const entity of entities) {
  ensureDir(path.join(ROOT, 'modules', entity.route));
  generateEntityFile(entity);
  generateDtoFiles(entity);
  generateServiceFile(entity);
  generateControllerFile(entity);
  generateModuleFile(entity);
}

// ---------------- app.module.ts ----------------
const appModuleContent = `import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
${entities.map(e => `import { ${e.className}Module } from './modules/${e.route}/${e.route}.module';`).join('\n')}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeOrmConfig),
${entities.map(e => `    ${e.className}Module,`).join('\n')}
  ],
})
export class AppModule {}
`;
writeFile(path.join(ROOT, 'app.module.ts'), appModuleContent);

console.log(`\\nGenerated ${entities.length} TypeORM entities + modules.`);
