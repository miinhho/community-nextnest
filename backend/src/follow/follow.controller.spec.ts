import { FollowModule } from '@/follow/follow.module';
import { Test, TestingModule } from '@nestjs/testing';
import { FollowController } from './follow.controller';

describe('FollowController', () => {
  let controller: FollowController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [FollowModule],
    }).compile();

    controller = module.get<FollowController>(FollowController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
