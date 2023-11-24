import { MigrationInterface, QueryRunner } from "typeorm";

export class ConnectBrandAndCarModel1699808745801 implements MigrationInterface {
    name = 'ConnectBrandAndCarModel1699808745801'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car_model" ADD "brandId" uuid`);
        await queryRunner.query(`ALTER TABLE "car_model" ADD CONSTRAINT "FK_e3920bc43fe2f7de05911630b3e" FOREIGN KEY ("brandId") REFERENCES "brand"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car_model" DROP CONSTRAINT "FK_e3920bc43fe2f7de05911630b3e"`);
        await queryRunner.query(`ALTER TABLE "car_model" DROP COLUMN "brandId"`);
    }

}
