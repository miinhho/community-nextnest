import { NotifyRepository } from '@/notify/notify.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NofifyService {
  constructor(private readonly notifyRepository: NotifyRepository) {}
}
