import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlockRepository {
  constructor(private readonly prisma: PrismaService) {}
}
