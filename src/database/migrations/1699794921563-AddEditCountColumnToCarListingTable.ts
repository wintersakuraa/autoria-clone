import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEditCountColumnToCarListingTable1699794921563 implements MigrationInterface {
    name = 'AddEditCountColumnToCarListingTable1699794921563'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car_listing" ADD "editCount" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car_listing" DROP COLUMN "editCount"`);
    }

}
