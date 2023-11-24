import 'dotenv/config';
import { MigrationInterface, QueryRunner } from 'typeorm';

import { User } from '@models/user/entities/user.entity';
import { AccountType, Role } from '@models/user/user.enums';

export class AddAdminUser1699805382849 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const username = process.env.ADMIN_USERNAME;
    const email = process.env.ADMIN_EMAIL;
    const phone = process.env.ADMIN_PHONE;
    const password = process.env.ADMIN_PASSWORD;

    const userRepository = queryRunner.manager.getRepository(User);

    const adminUser = new User();
    adminUser.username = username;
    adminUser.email = email;
    adminUser.password = password;
    adminUser.phone = phone;
    adminUser.role = Role.ADMIN;
    adminUser.accountType = AccountType.PREMIUM;

    await userRepository.save(adminUser);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {}
}
