import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import { HotelModule } from './modules/hotels/hotels.module';
import { UserModule } from './modules/users/users.module';
import { DepartmentModule } from './modules/departments/departments.module';
import { EmployeeModule } from './modules/employees/employees.module';
import { EmploymentAssignmentModule } from './modules/employment-assignments/employment-assignments.module';
import { SalaryHistoryModule } from './modules/salary-history/salary-history.module';
import { BonusDeductionModule } from './modules/bonus-deductions/bonus-deductions.module';
import { AttendanceRecordModule } from './modules/attendance-records/attendance-records.module';
import { LeaveRequestModule } from './modules/leave-requests/leave-requests.module';
import { LoanModule } from './modules/loans/loans.module';
import { AdvanceModule } from './modules/advances/advances.module';
import { PayrollPeriodModule } from './modules/payroll-periods/payroll-periods.module';
import { PayrollRunModule } from './modules/payroll-runs/payroll-runs.module';
import { PayrollItemModule } from './modules/payroll-items/payroll-items.module';
import { EmployeeBankAccountModule } from './modules/employee-bank-accounts/employee-bank-accounts.module';
import { EmployeeDocumentModule } from './modules/employee-documents/employee-documents.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    HotelModule,
    UserModule,
    DepartmentModule,
    EmployeeModule,
    EmploymentAssignmentModule,
    SalaryHistoryModule,
    BonusDeductionModule,
    AttendanceRecordModule,
    LeaveRequestModule,
    LoanModule,
    AdvanceModule,
    PayrollPeriodModule,
    PayrollRunModule,
    PayrollItemModule,
    EmployeeBankAccountModule,
    EmployeeDocumentModule,
  ],
})
export class AppModule {}
