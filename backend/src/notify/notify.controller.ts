import { NofifyService } from '@/notify/notify.service';
import { Controller } from '@nestjs/common';

@Controller()
export class NotifyController {
  constructor(private readonly notifyService: NofifyService) {}
}
