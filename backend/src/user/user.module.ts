import { PrismaService } from '@/common/database/prisma.service';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  providers: [UserService, PrismaService],
  controllers: [UserController],
})
export class UserModule {}
