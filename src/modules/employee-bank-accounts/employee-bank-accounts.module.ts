import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeBankAccount } from '../../models/employee-bank-account.entity';
import { EmployeeBankAccountController } from './employee-bank-accounts.controller';
import { EmployeeBankAccountService } from './employee-bank-accounts.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeBankAccount])],
  controllers: [EmployeeBankAccountController],
  providers: [EmployeeBankAccountService],
  exports: [EmployeeBankAccountService],
})
export class EmployeeBankAccountModule {}
