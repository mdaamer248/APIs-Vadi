import { Test, TestingModule } from '@nestjs/testing';
import { InvestorController } from './investor.controller';
import { InvestorService } from './investor.service';

describe('InvestorController', () => {
  let controller: InvestorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvestorController],
      providers: [InvestorService],
    }).compile();

    controller = module.get<InvestorController>(InvestorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
