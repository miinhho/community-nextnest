import { PrivateRepository } from '@/private/private.repository';
import { PrivateService } from '@/private/private.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('PrivateService', () => {
  let service: PrivateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrivateService, PrivateRepository],
    }).compile();

    service = module.get<PrivateService>(PrivateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
