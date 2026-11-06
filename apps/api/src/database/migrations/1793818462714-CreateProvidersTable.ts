import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProvidersTable1793818462714 implements MigrationInterface {
    name = 'CreateProvidersTable1793818462714'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "providers" ("id" SERIAL NOT NULL, "name" character varying(150) NOT NULL, "email" character varying(254) NOT NULL, "phone" character varying(30), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_af13fc2ebf382fe0dad2e4793aa" PRIMARY KEY ("id"))`);

        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_providers_email_lower" ON "providers" (LOWER("email"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "providers"`);
    }

}
