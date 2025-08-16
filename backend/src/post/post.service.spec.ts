import { BlockService } from '@/block/block.service';
import { NotifyPublisher } from '@/notify/event/notify.publisher';
import { PostCacheService } from '@/post/cache/post-cache.service';
import { PostRepository } from '@/post/post.repository';
import { PostService } from '@/post/post.service';
import { PrivateService } from '@/private/private.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('PostService', () => {
  let service: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        PostRepository,
        PrivateService,
        BlockService,
        PostCacheService,
        NotifyPublisher,
      ],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
