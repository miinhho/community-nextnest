import { InternalServerErrorException } from '@nestjs/common';

export class PrismaDBError extends InternalServerErrorException {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
  }
}
