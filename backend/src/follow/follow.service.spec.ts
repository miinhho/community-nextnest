import { BlockService } from '@/block/block.service';
import { FollowRepository } from '@/follow/follow.repository';
import { FollowService } from '@/follow/follow.service';
import { NotifyPublisher } from '@/notify/event/notify.publisher';
import { PrivateService } from '@/private/private.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('FollowService', () => {
  let service: FollowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FollowRepository, PrivateService, BlockService, NotifyPublisher, FollowService],
    }).compile();

    service = module.get<FollowService>(FollowService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
