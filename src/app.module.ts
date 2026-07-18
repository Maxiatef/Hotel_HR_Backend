import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { HotelScopeGuard } from './common/guards/hotel-scope.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { typeOrmConfig } from './config/typeorm.config';
import { HealthModule } from './modules/health/health.module';
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
import { GeofenceZoneModule } from './modules/geofence-zones/geofence-zones.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeOrmConfig),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 second
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000, // 10 seconds
        limit: 20,
      },
      {
        name: 'long',
        ttl: 60000, // 1 minute
        limit: 100,
      },
    ]),
    HealthModule,
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
    GeofenceZoneModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // HotelScopeGuard must run before RolesGuard: it's the one that verifies the
    // JWT and sets request.role/hotelId, which RolesGuard then reads. NestJS runs
    // multiple APP_GUARD providers in registration order, so this order matters.
    {
      provide: APP_GUARD,
      useClass: HotelScopeGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
