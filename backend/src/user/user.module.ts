import { PrismaModule } from '@/prisma/prisma.module';
import { PrivateModule } from '@/private/private.module';
import { UserRepository } from '@/user/user.repository';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [PrismaModule, PrivateModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
