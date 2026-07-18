import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTaxFieldsToEmployees1752700000006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE employees ADD COLUMN IF NOT EXISTS "hasTax" boolean NOT NULL DEFAULT true`);
    await queryRunner.query(`ALTER TABLE employees ADD COLUMN IF NOT EXISTS "taxRate" decimal(5,4) NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE employees DROP COLUMN IF EXISTS "hasTax"`);
    await queryRunner.query(`ALTER TABLE employees DROP COLUMN IF EXISTS "taxRate"`);
  }
}
