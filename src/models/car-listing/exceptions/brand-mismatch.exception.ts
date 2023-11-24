import { BadRequestException } from '@nestjs/common';

export class BrandMismatchException extends BadRequestException {
  constructor() {
    super('Given brand does not have such car model');
  }
}
