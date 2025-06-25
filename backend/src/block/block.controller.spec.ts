import { BlockModule } from '@/block/block.module';
import { Test, TestingModule } from '@nestjs/testing';
import { BlockController } from './block.controller';

describe('BlockController', () => {
  let controller: BlockController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BlockModule],
    }).compile();

    controller = module.get<BlockController>(BlockController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
