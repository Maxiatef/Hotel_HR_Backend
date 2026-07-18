import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAttendanceRecordColumns1752700000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "attendance_records"
      ADD COLUMN IF NOT EXISTS "zoneId" VARCHAR,
      ADD COLUMN IF NOT EXISTS "zoneName" VARCHAR,
      ADD COLUMN IF NOT EXISTS "zoneEnteredAt" TIMESTAMP,
      ADD COLUMN IF NOT EXISTS "hoursWorked" DECIMAL(10,2) DEFAULT 0
    `);

    // Update existing records with default 8 hours to 0 if checkOut is NULL (still clocked in)
    await queryRunner.query(`
      UPDATE "attendance_records"
      SET "hoursWorked" = 0
      WHERE "checkOut" IS NULL AND "hoursWorked" = 8
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "attendance_records"
      DROP COLUMN IF EXISTS "zoneId",
      DROP COLUMN IF EXISTS "zoneName",
      DROP COLUMN IF EXISTS "zoneEnteredAt",
      DROP COLUMN IF EXISTS "hoursWorked"
    `);
  }
}
