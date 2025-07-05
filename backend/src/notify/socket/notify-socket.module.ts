import { NotifyGateway } from '@/notify/socket/notify.gateway';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [NotifyGateway, JwtService],
})
export class NotifySocketModule {}
