import { ForbiddenException } from '@nestjs/common';

export class BasicAccountLimitException extends ForbiddenException {
  constructor() {
    super('Basic account users can only create one car listing');
  }
}
