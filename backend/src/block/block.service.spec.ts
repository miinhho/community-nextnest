import { BlockRepository } from '@/block/block.repository';
import { BlockService } from '@/block/block.service';
import { BlockedError } from '@/block/error/blocked.error';
import { UserBlockedError } from '@/block/error/user-blocked.error';
import { Test, TestingModule } from '@nestjs/testing';

describe('BlockService', () => {
  let service: BlockService;
  let repository: BlockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlockService, BlockRepository],
    })
      .overrideProvider(BlockRepository)
      .useValue({
        isUserBlocked: jest.fn(),
      })
      .compile();

    service = module.get<BlockService>(BlockService);
    repository = module.get<BlockRepository>(BlockRepository);
  });

  it('모듈이 제대로 생성되어 서비스가 정의되어야 합니다', () => {
    expect(service).toBeDefined();
  });

  it('isUserBlocked: 내가 차단했을 때 throwError가 true 이면 UserBlockedError 를 던져야 합니다', async () => {
    jest.spyOn(repository, 'isUserBlocked').mockResolvedValue({
      userBlocked: true,
      targetBlocked: false,
    });

    await expect(
      service.isUserBlocked({ userId: 'user1', targetId: 'user2' }, true),
    ).rejects.toBeInstanceOf(UserBlockedError);
  });

  it('isUserBlocked: 상대방이 나를 차단했을 때 throwError가 true 이면 BlockedError 를 던져야 합니다', async () => {
    jest.spyOn(repository, 'isUserBlocked').mockResolvedValue({
      userBlocked: false,
      targetBlocked: true,
    });

    await expect(
      service.isUserBlocked({ userId: 'user1', targetId: 'user2' }, true),
    ).rejects.toBeInstanceOf(BlockedError);
  });
});
