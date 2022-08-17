import { Test, TestingModule } from '@nestjs/testing';
import { InvestorProfileService } from './investor-profile.service';

describe('InvestorProfileService', () => {
  let service: InvestorProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvestorProfileService],
    }).compile();

    service = module.get<InvestorProfileService>(InvestorProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
