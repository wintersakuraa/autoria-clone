import { MigrationInterface, QueryRunner } from "typeorm";

export class CascadeDeleteCarListings1699774747725 implements MigrationInterface {
    name = 'CascadeDeleteCarListings1699774747725'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car_listing" DROP CONSTRAINT "FK_56ac1875b11a5a593437621e262"`);
        await queryRunner.query(`ALTER TABLE "car_listing" ADD CONSTRAINT "FK_56ac1875b11a5a593437621e262" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car_listing" DROP CONSTRAINT "FK_56ac1875b11a5a593437621e262"`);
        await queryRunner.query(`ALTER TABLE "car_listing" ADD CONSTRAINT "FK_56ac1875b11a5a593437621e262" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
