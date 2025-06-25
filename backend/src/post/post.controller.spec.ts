import { PostModule } from '@/post/post.module';
import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';

describe('PostController', () => {
  let controller: PostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PostModule],
    }).compile();

    controller = module.get<PostController>(PostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
