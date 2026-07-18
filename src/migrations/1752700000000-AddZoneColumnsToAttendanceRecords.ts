import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddZoneColumnsToAttendanceRecords1752700000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "attendance_records"
      ADD COLUMN IF NOT EXISTS "zoneId" VARCHAR
    `);
    await queryRunner.query(`
      ALTER TABLE "attendance_records"
      ADD COLUMN IF NOT EXISTS "zoneName" VARCHAR
    `);
    await queryRunner.query(`
      ALTER TABLE "attendance_records"
      ADD COLUMN IF NOT EXISTS "zoneEnteredAt" TIMESTAMP
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "attendance_records"
      DROP COLUMN IF EXISTS "zoneEnteredAt"
    `);
    await queryRunner.query(`
      ALTER TABLE "attendance_records"
      DROP COLUMN IF EXISTS "zoneName"
    `);
    await queryRunner.query(`
      ALTER TABLE "attendance_records"
      DROP COLUMN IF EXISTS "zoneId"
    `);
  }
}
