import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotifyRepository {
  private readonly logger = new Logger(NotifyRepository.name);

  constructor(private readonly prisma: PrismaService) {}
}
