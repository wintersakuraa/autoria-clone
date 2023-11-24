import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageColumnToCarListingTable1699816700131 implements MigrationInterface {
    name = 'AddImageColumnToCarListingTable1699816700131'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car_listing" ADD "image" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car_listing" DROP COLUMN "image"`);
    }

}
