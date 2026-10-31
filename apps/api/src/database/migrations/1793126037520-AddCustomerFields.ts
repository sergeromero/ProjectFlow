import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCustomerFields1793126037520 implements MigrationInterface {
    name = 'AddCustomerFields1793126037520'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add email as nullable initially so existing records remain valid.
        await queryRunner.query(`ALTER TABLE "customers" ADD "email" character varying(254)`);

        // Backfill existing records with a deterministic placeholder. 
        await queryRunner.query(`UPDATE "customers" SET "email" = 'legacy-customer-' || "id" || '@example.invalid.com' WHERE "email" IS NULL`);
        
        // Enforce the required email constraint after backfilling. 
        await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "email" SET NOT NULL`); 
        
        await queryRunner.query(`ALTER TABLE "customers" ADD "is_active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);

        // Prevent duplicate email addresses regardless of letter casing. 
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_customers_email_lower" ON "customers" (LOWER("email"))`);        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "is_active"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "email"`);
    }

}
