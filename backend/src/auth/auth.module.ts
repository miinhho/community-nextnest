import { JwtStrategy } from '@/auth/strategy/jwt.strategy';
import { LocalStrategy } from '@/auth/strategy/local.strategy';
import { PrismaService } from '@/common/database/prisma.service';
import { UserModule } from '@/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('jwt.accessSecret'),
        signOptions: { expiresIn: config.get<number>('jwt.accessExpiration') },
      }),
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, PrismaService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
