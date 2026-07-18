import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1720000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "hotels" (
        "id"        UUID NOT NULL DEFAULT gen_random_uuid(),
        "code"      VARCHAR NOT NULL,
        "name"      VARCHAR NOT NULL,
        "city"      VARCHAR,
        "isActive"  BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_hotels" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_hotels_code" UNIQUE ("code")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "departments" (
        "id"        UUID NOT NULL DEFAULT gen_random_uuid(),
        "hotelId"   VARCHAR NOT NULL,
        "name"      VARCHAR NOT NULL,
        "isActive"  BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_departments" PRIMARY KEY ("id"),
        CONSTRAINT "FK_departments_hotel" FOREIGN KEY ("hotelId") REFERENCES "hotels"("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id"          UUID NOT NULL DEFAULT gen_random_uuid(),
        "hotelId"     VARCHAR NOT NULL,
        "employeeId"  VARCHAR UNIQUE,
        "role"        VARCHAR NOT NULL DEFAULT 'hr',
        "username"    VARCHAR NOT NULL,
        "email"       VARCHAR NOT NULL,
        "passwordHash" VARCHAR NOT NULL,
        "isActive"    BOOLEAN NOT NULL DEFAULT true,
        "lastLoginAt" TIMESTAMP,
        "createdAt"   TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_username" UNIQUE ("username"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "FK_users_hotel" FOREIGN KEY ("hotelId") REFERENCES "hotels"("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "employees" (
        "id"                     UUID NOT NULL DEFAULT gen_random_uuid(),
        "employeeCode"           VARCHAR NOT NULL,
        "hotelId"                VARCHAR NOT NULL,
        "departmentId"           VARCHAR,
        "employmentType"         VARCHAR,
        "workStatus"             VARCHAR NOT NULL DEFAULT 'active',
        "hourlyRate"             DECIMAL(10,2),
        "firstName"              VARCHAR NOT NULL,
        "middleName"             VARCHAR,
        "lastName"               VARCHAR NOT NULL,
        "birthDate"              DATE,
        "gender"                 VARCHAR,
        "nationality"            VARCHAR,
        "nationalId"             VARCHAR,
        "maritalStatus"          VARCHAR,
        "phone"                  VARCHAR,
        "email"                  VARCHAR,
        "address"                TEXT,
        "position"               VARCHAR,
        "emergencyContactName"   VARCHAR,
        "emergencyContactPhone"  VARCHAR,
        "isActive"               BOOLEAN NOT NULL DEFAULT true,
        "createdAt"              TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt"              TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_employees" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_employees_code" UNIQUE ("employeeCode"),
        CONSTRAINT "FK_employees_hotel" FOREIGN KEY ("hotelId") REFERENCES "hotels"("id"),
        CONSTRAINT "FK_employees_dept"  FOREIGN KEY ("departmentId") REFERENCES "departments"("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "employment_assignments" (
        "id"             UUID NOT NULL DEFAULT gen_random_uuid(),
        "employeeId"     VARCHAR NOT NULL,
        "hotelId"        VARCHAR NOT NULL,
        "departmentId"   VARCHAR,
        "startDate"      DATE NOT NULL,
        "endDate"        DATE,
        "employmentType" VARCHAR,
        "workStatus"     VARCHAR,
        "transferReason" TEXT,
        "createdAt"      TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_employment_assignments" PRIMARY KEY ("id"),
        CONSTRAINT "FK_ea_employee" FOREIGN KEY ("employeeId") REFERENCES "employees"("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "salary_history" (
        "id"                      UUID NOT NULL DEFAULT gen_random_uuid(),
        "employeeId"              VARCHAR NOT NULL,
        "hotelId"                 VARCHAR NOT NULL,
        "baseSalary"              DECIMAL(12,2) NOT NULL,
        "housingAllowance"        DECIMAL(12,2) NOT NULL DEFAULT 0,
        "transportationAllowance" DECIMAL(12,2) NOT NULL DEFAULT 0,
        "otherFixedAllowance"     DECIMAL(12,2) NOT NULL DEFAULT 0,
        "effectiveFrom"           DATE NOT NULL,
        "effectiveTo"             DATE,
        "createdBy"               VARCHAR,
        "createdAt"               TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_salary_history" PRIMARY KEY ("id"),
        CONSTRAINT "FK_sh_employee" FOREIGN KEY ("employeeId") REFERENCES "employees"("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "bonus_deductions" (
        "id"             UUID NOT NULL DEFAULT gen_random_uuid(),
        "employeeId"     VARCHAR NOT NULL,
        "hotelId"        VARCHAR NOT NULL,
        "payrollPeriodId" VARCHAR,
        "type"           VARCHAR NOT NULL,
        "reason"         TEXT,
        "amount"         DECIMAL(12,2) NOT NULL,
        "status"         VARCHAR NOT NULL DEFAULT 'approved',
        "createdBy"      VARCHAR,
        "createdAt"      TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_bonus_deductions" PRIMARY KEY ("id"),
        CONSTRAINT "FK_bd_employee" FOREIGN KEY ("employeeId") REFERENCES "employees"("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "attendance_records" (
        "id"            UUID NOT NULL DEFAULT gen_random_uuid(),
        "employeeId"    VARCHAR NOT NULL,
        "hotelId"       VARCHAR NOT NULL,
        "workDate"      DATE NOT NULL,
        "checkIn"       TIMESTAMP,
        "checkOut"      TIMESTAMP,
        "zoneId"        VARCHAR,
        "zoneName"      VARCHAR,
        "zoneEnteredAt" TIMESTAMP,
        "hoursWorked"   DECIMAL(5,2) NOT NULL DEFAULT 8,
        "overtimeHours" DECIMAL(5,2) NOT NULL DEFAULT 0,
        "status"        VARCHAR NOT NULL DEFAULT 'present',
        CONSTRAINT "PK_attendance_records" PRIMARY KEY ("id"),
        CONSTRAINT "FK_ar_employee" FOREIGN KEY ("employeeId") REFERENCES "employees"("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "leave_requests" (
        "id"         UUID NOT NULL DEFAULT gen_random_uuid(),
        "employeeId" VARCHAR NOT NULL,
        "hotelId"    VARCHAR NOT NULL,
        "leaveType"  VARCHAR NOT NULL,
        "startDate"  DATE NOT NULL,
        "endDate"    DATE NOT NULL,
        "status"     VARCHAR NOT NULL DEFAULT 'pending',
        "reason"     TEXT,
        "createdAt"  TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_leave_requests" PRIMARY KEY ("id"),
        CONSTRAINT "FK_lr_employee" FOREIGN KEY ("employeeId") REFERENCES "employees"("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "loans" (
        "id"                 UUID NOT NULL DEFAULT gen_random_uuid(),
        "employeeId"         VARCHAR NOT NULL,
        "hotelId"            VARCHAR NOT NULL,
        "principalAmount"    DECIMAL(12,2) NOT NULL,
        "remainingAmount"    DECIMAL(12,2) NOT NULL,
        "monthlyInstallment" DECIMAL(12,2) NOT NULL DEFAULT 0,
        "startDate"          DATE NOT NULL,
        "status"             VARCHAR NOT NULL DEFAULT 'active',
        "createdAt"          TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_loans" PRIMARY KEY ("id"),
        CONSTRAINT "FK_loans_employee" FOREIGN KEY ("employeeId") REFERENCES "employees"("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "advances" (
        "id"          UUID NOT NULL DEFAULT gen_random_uuid(),
        "employeeId"  VARCHAR NOT NULL,
        "hotelId"     VARCHAR NOT NULL,
        "amount"      DECIMAL(12,2) NOT NULL,
        "requestDate" DATE NOT NULL,
        "status"      VARCHAR NOT NULL DEFAULT 'pending',
        "createdAt"   TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_advances" PRIMARY KEY ("id"),
        CONSTRAINT "FK_advances_employee" FOREIGN KEY ("employeeId") REFERENCES "employees"("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "payroll_periods" (
        "id"        UUID NOT NULL DEFAULT gen_random_uuid(),
        "hotelId"   VARCHAR NOT NULL,
        "year"      INTEGER NOT NULL,
        "month"     INTEGER NOT NULL,
        "status"    VARCHAR NOT NULL DEFAULT 'open',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_payroll_periods" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "payroll_runs" (
        "id"             UUID NOT NULL DEFAULT gen_random_uuid(),
        "hotelId"        VARCHAR NOT NULL,
        "payrollPeriodId" VARCHAR NOT NULL,
        "createdBy"      VARCHAR,
        "runAt"          TIMESTAMP NOT NULL DEFAULT now(),
        "status"         VARCHAR NOT NULL DEFAULT 'draft',
        "totalGross"     DECIMAL(14,2) NOT NULL DEFAULT 0,
        "totalNet"       DECIMAL(14,2) NOT NULL DEFAULT 0,
        CONSTRAINT "PK_payroll_runs" PRIMARY KEY ("id"),
        CONSTRAINT "FK_pr_period" FOREIGN KEY ("payrollPeriodId") REFERENCES "payroll_periods"("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "payroll_items" (
        "id"                   UUID NOT NULL DEFAULT gen_random_uuid(),
        "payrollRunId"         VARCHAR NOT NULL,
        "employeeId"           VARCHAR NOT NULL,
        "hotelId"              VARCHAR NOT NULL,
        "baseSalary"           DECIMAL(12,2) NOT NULL,
        "fixedAllowances"      DECIMAL(12,2) NOT NULL DEFAULT 0,
        "bonusTotal"           DECIMAL(12,2) NOT NULL DEFAULT 0,
        "deductionTotal"       DECIMAL(12,2) NOT NULL DEFAULT 0,
        "overtimeTotal"        DECIMAL(12,2) NOT NULL DEFAULT 0,
        "leaveDeductionTotal"  DECIMAL(12,2) NOT NULL DEFAULT 0,
        "loanDeductionTotal"   DECIMAL(12,2) NOT NULL DEFAULT 0,
        "advanceDeductionTotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
        "socialInsuranceTotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
        "taxTotal"             DECIMAL(12,2) NOT NULL DEFAULT 0,
        "netSalary"            DECIMAL(12,2) NOT NULL,
        "createdAt"            TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_payroll_items" PRIMARY KEY ("id"),
        CONSTRAINT "FK_pi_run" FOREIGN KEY ("payrollRunId") REFERENCES "payroll_runs"("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "employee_bank_accounts" (
        "id"            UUID NOT NULL DEFAULT gen_random_uuid(),
        "employeeId"    VARCHAR NOT NULL,
        "hotelId"       VARCHAR NOT NULL,
        "bankName"      VARCHAR NOT NULL,
        "accountNumber" VARCHAR NOT NULL,
        "iban"          VARCHAR,
        "isPrimary"     BOOLEAN NOT NULL DEFAULT true,
        CONSTRAINT "PK_employee_bank_accounts" PRIMARY KEY ("id"),
        CONSTRAINT "FK_eba_employee" FOREIGN KEY ("employeeId") REFERENCES "employees"("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "employee_documents" (
        "id"           UUID NOT NULL DEFAULT gen_random_uuid(),
        "employeeId"   VARCHAR NOT NULL,
        "hotelId"      VARCHAR NOT NULL,
        "documentType" VARCHAR NOT NULL,
        "fileUrl"      VARCHAR,
        "expiryDate"   DATE,
        CONSTRAINT "PK_employee_documents" PRIMARY KEY ("id"),
        CONSTRAINT "FK_ed_employee" FOREIGN KEY ("employeeId") REFERENCES "employees"("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "geofence_zones" (
        "id"        UUID NOT NULL DEFAULT gen_random_uuid(),
        "hotelId"   VARCHAR NOT NULL,
        "name"      VARCHAR NOT NULL,
        "points"    JSONB NOT NULL,
        "isActive"  BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_geofence_zones" PRIMARY KEY ("id"),
        CONSTRAINT "FK_gz_hotel" FOREIGN KEY ("hotelId") REFERENCES "hotels"("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "geofence_zones"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "employee_documents"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "employee_bank_accounts"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "payroll_items"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "payroll_runs"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "payroll_periods"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "advances"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "loans"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "leave_requests"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "attendance_records"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "bonus_deductions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "salary_history"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "employment_assignments"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "employees"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "departments"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "hotels"`);
  }
}
