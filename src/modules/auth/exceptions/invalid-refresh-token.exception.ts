import { ForbiddenException } from '@nestjs/common';

export class InvalidRefreshTokenException extends ForbiddenException {
  constructor() {
    super('Please, provide valid RT token');
  }
}
