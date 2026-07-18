import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSocialInsuranceToEmployees1752700000005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE employees ADD COLUMN IF NOT EXISTS "hasSocialInsurance" boolean NOT NULL DEFAULT true`);
    await queryRunner.query(`ALTER TABLE employees ADD COLUMN IF NOT EXISTS "socialInsuranceRate" decimal(5,4) NOT NULL DEFAULT 0.11`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE employees DROP COLUMN IF EXISTS "hasSocialInsurance"`);
    await queryRunner.query(`ALTER TABLE employees DROP COLUMN IF EXISTS "socialInsuranceRate"`);
  }
}
