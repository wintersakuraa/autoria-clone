import { BadRequestException } from '@nestjs/common';

export class EditCountLimitException extends BadRequestException {
  constructor() {
    super(
      'You have reached the maximum allowed edit limit. Your listing has been removed from the platform',
    );
  }
}
