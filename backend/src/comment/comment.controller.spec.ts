import { CommentModule } from '@/comment/comment.module';
import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comment.controller';

describe('CommentController', () => {
  let controller: CommentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CommentModule],
    }).compile();

    controller = module.get<CommentController>(CommentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
