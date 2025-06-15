import { PrismaService } from '@/common/database/prisma.service';
import { UserRepository } from '@/user/user.repository';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, PrismaService],
  exports: [UserService, UserRepository],
})
export class UserModule {}
