import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexesAndClockInConstraint1753000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── attendance_records ───────────────────────────────────────────────────
    // Fast lookup for all queries scoped by hotel
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_attendance_hotelId"
      ON "attendance_records" ("hotelId")
    `);
    // Fast lookup for clock-in/out check and getTodayForEmployee
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_attendance_employee_date"
      ON "attendance_records" ("employeeId", "workDate")
    `);
    // Partial unique index: only ONE open record (no checkout) per employee per day.
    // Allows multiple completed records (clock-in/out cycles) on the same day.
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_attendance_one_open_per_employee_day"
      ON "attendance_records" ("employeeId", "workDate")
      WHERE "checkOut" IS NULL
    `);

    // ── employees ────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_employees_hotelId"
      ON "employees" ("hotelId")
    `);

    // ── payroll_items ────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_payroll_items_runId"
      ON "payroll_items" ("payrollRunId")
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_payroll_items_hotelId"
      ON "payroll_items" ("hotelId")
    `);

    // ── payroll_runs ─────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_payroll_runs_hotelId"
      ON "payroll_runs" ("hotelId")
    `);

    // ── leave_requests ───────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_leave_requests_hotelId"
      ON "leave_requests" ("hotelId")
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_leave_requests_employeeId"
      ON "leave_requests" ("employeeId")
    `);

    // ── advances ─────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_advances_hotelId"
      ON "advances" ("hotelId")
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_advances_employeeId"
      ON "advances" ("employeeId")
    `);

    // ── loans ────────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_loans_hotelId"
      ON "loans" ("hotelId")
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_loans_employeeId"
      ON "loans" ("employeeId")
    `);

    // ── bonus_deductions ─────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_bonus_deductions_hotelId"
      ON "bonus_deductions" ("hotelId")
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_bonus_deductions_employeeId"
      ON "bonus_deductions" ("employeeId")
    `);

    // ── departments ──────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_departments_hotelId"
      ON "departments" ("hotelId")
    `);

    // ── geofence_zones ───────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_geofence_zones_hotelId"
      ON "geofence_zones" ("hotelId")
    `);

    // ── users ────────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_users_hotelId"
      ON "users" ("hotelId")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_attendance_one_open_per_employee_day"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_attendance_employee_date"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_attendance_hotelId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_employees_hotelId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_payroll_items_runId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_payroll_items_hotelId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_payroll_runs_hotelId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_leave_requests_hotelId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_leave_requests_employeeId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_advances_hotelId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_advances_employeeId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_loans_hotelId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_loans_employeeId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_bonus_deductions_hotelId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_bonus_deductions_employeeId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_departments_hotelId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_geofence_zones_hotelId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_hotelId"`);
  }
}
