import { ForbiddenException } from '@nestjs/common';

export class AccessDeniedException extends ForbiddenException {
  constructor() {
    super('Access Denied');
  }
}
