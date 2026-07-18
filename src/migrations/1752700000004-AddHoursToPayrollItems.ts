import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddHoursToPayrollItems1752700000004 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE payroll_items ADD COLUMN "totalHoursWorked" decimal(8,2) NOT NULL DEFAULT 0`);
    await queryRunner.query(`ALTER TABLE payroll_items ADD COLUMN "totalOvertimeHours" decimal(8,2) NOT NULL DEFAULT 0`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    // SQLite does not support DROP COLUMN — handled by recreating the table if needed
  }
}
