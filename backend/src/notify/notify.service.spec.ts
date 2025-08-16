import { NotifyRepository } from '@/notify/notify.repository';
import { NotifyService } from '@/notify/notify.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('NotifyService', () => {
  let service: NotifyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotifyService, NotifyRepository],
    }).compile();

    service = module.get<NotifyService>(NotifyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
