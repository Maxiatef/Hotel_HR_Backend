import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddHourlyRateToEmployees1752700000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "employees"
      ADD COLUMN IF NOT EXISTS "hourlyRate" DECIMAL(10,2)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "employees"
      DROP COLUMN IF EXISTS "hourlyRate"
    `);
  }
}
