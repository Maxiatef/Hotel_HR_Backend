import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixHoursWorkedDefault1752700000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Update existing records still clocked in to have 0 hours
    await queryRunner.query(`
      UPDATE "attendance_records"
      SET "hoursWorked" = 0
      WHERE "checkOut" IS NULL AND "hoursWorked" = 8
    `);

    // Alter column default
    await queryRunner.query(`
      ALTER TABLE "attendance_records"
      ALTER COLUMN "hoursWorked" SET DEFAULT 0
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "attendance_records"
      ALTER COLUMN "hoursWorked" SET DEFAULT 8
    `);
  }
}
