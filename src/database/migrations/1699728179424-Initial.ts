import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1699728179424 implements MigrationInterface {
  name = 'Initial1699728179424';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "car_model" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "name" character varying NOT NULL, CONSTRAINT "PK_525071eea12c671d67e35a5cbc8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum" AS ENUM('Buyer', 'Seller', 'Manager', 'Admin')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_accounttype_enum" AS ENUM('Basic', 'Premium')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "phone" character varying NOT NULL, "refreshToken" character varying, "isBlocked" boolean NOT NULL DEFAULT false, "role" "public"."user_role_enum" NOT NULL DEFAULT 'Buyer', "accountType" "public"."user_accounttype_enum" NOT NULL DEFAULT 'Basic', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."car_listing_region_enum" AS ENUM('Vinnytsia', 'Volyn', 'Dnipropetrovsk', 'Donetsk', 'Zhytomyr', 'Zakarpattia', 'Zaporizhia', 'Ivano-Frankivsk', 'Kyiv', 'Kirovohrad', 'Luhansk', 'Lviv', 'Mykolaiv', 'Odesa', 'Poltava', 'Rivne', 'Sumy', 'Ternopil', 'Kharkiv', 'Kherson', 'Khmelnytskyi', 'Cherkasy', 'Chernivtsi', 'Chernihiv', 'Republic of Crimea')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."car_listing_currency_enum" AS ENUM('USD', 'EUR', 'UAH')`,
    );
    await queryRunner.query(
      `CREATE TABLE "car_listing" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "description" character varying NOT NULL, "region" "public"."car_listing_region_enum" NOT NULL, "year" integer NOT NULL, "price" numeric(10,2) NOT NULL DEFAULT '0', "currency" "public"."car_listing_currency_enum" NOT NULL DEFAULT 'UAH', "isActive" boolean NOT NULL DEFAULT false, "totalViews" integer NOT NULL DEFAULT '0', "dailyViews" integer NOT NULL DEFAULT '0', "weeklyViews" integer NOT NULL DEFAULT '0', "monthlyViews" integer NOT NULL DEFAULT '0', "userId" uuid, "brandId" uuid, "modelId" uuid, CONSTRAINT "PK_1002accb75e625ec98eeb441136" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "brand" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "name" character varying NOT NULL, CONSTRAINT "PK_a5d20765ddd942eb5de4eee2d7f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "car_listing" ADD CONSTRAINT "FK_56ac1875b11a5a593437621e262" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "car_listing" ADD CONSTRAINT "FK_618c21899a9162e083208272fd5" FOREIGN KEY ("brandId") REFERENCES "brand"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "car_listing" ADD CONSTRAINT "FK_3aa3f05f34a2feab7e5d6e49abe" FOREIGN KEY ("modelId") REFERENCES "car_model"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "car_listing" DROP CONSTRAINT "FK_3aa3f05f34a2feab7e5d6e49abe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "car_listing" DROP CONSTRAINT "FK_618c21899a9162e083208272fd5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "car_listing" DROP CONSTRAINT "FK_56ac1875b11a5a593437621e262"`,
    );
    await queryRunner.query(`DROP TABLE "brand"`);
    await queryRunner.query(`DROP TABLE "car_listing"`);
    await queryRunner.query(`DROP TYPE "public"."car_listing_currency_enum"`);
    await queryRunner.query(`DROP TYPE "public"."car_listing_region_enum"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_accounttype_enum"`);
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    await queryRunner.query(`DROP TABLE "car_model"`);
  }
}
