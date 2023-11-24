import { BadRequestException } from '@nestjs/common';

export class ModelNotFoundException extends BadRequestException {
  constructor(model: string) {
    super(`${model} not found`);
  }
}
