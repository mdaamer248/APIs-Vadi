import { Test, TestingModule } from '@nestjs/testing';
import { InvestorProfileController } from './investor-profile.controller';
import { InvestorProfileService } from './investor-profile.service';

describe('InvestorProfileController', () => {
  let controller: InvestorProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvestorProfileController],
      providers: [InvestorProfileService],
    }).compile();

    controller = module.get<InvestorProfileController>(InvestorProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
