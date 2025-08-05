import { JwtStrategy } from '@/auth/strategy/jwt.strategy';
import { LocalStrategy } from '@/auth/strategy/local.strategy';
import { RefreshTokenService } from '@/auth/token/refresh-token.service';
import { TokenService } from '@/auth/token/token.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { PrismaService } from '@/prisma/prisma.service';
import { UserModule } from '@/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('jwt.accessSecret'),
        signOptions: { expiresIn: config.get<number>('jwt.accessExpiration') },
      }),
    }),
    UserModule,
    PrismaModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    PrismaService,
    TokenService,
    RefreshTokenService,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
