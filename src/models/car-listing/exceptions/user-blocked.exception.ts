import { ForbiddenException } from '@nestjs/common';

export class UserBlockedException extends ForbiddenException {
  constructor() {
    super('Blocked user cannot perform this action');
  }
}
