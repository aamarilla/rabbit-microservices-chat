import { MigrationInterface, QueryRunner } from "typeorm";

export class SecondMigration1764071480163 implements MigrationInterface {
    name = 'SecondMigration1764071480163'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "firstName" TO "name"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "name" TO "firstName"`);
    }

}
