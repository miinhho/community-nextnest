import recommendConfig from '@/config/recommend.config';
import { PostRecommendService } from '@/post/recommend/post-recommend.service';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

describe('PostRecommendService', () => {
  let service: PostRecommendService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test.local',
          load: [recommendConfig],
          isGlobal: true,
        }),
      ],
      providers: [PostRecommendService],
    }).compile();

    service = module.get<PostRecommendService>(PostRecommendService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
