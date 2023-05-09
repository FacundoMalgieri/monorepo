import { Test, TestingModule } from '@nestjs/testing';
import { mock, MockProxy } from 'jest-mock-extended';

import { RateController } from './rate.controller';
import { RateService } from './rate.service';
import { Rate } from './rate.entity';

describe('RateController', () => {
  let rateController: RateController;
  let rateService: MockProxy<RateService>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RateController],
      providers: [
        { provide: RateService, useFactory: () => mock(RateService) },
      ],
    }).compile();

    rateController = module.get<RateController>(RateController);
    rateService = module.get<MockProxy<RateService>>(RateService);
  });

  describe('updateRate', () => {
    it('should update rate and return updated rate', async () => {
      const address = '0x1234567890123456789012345678901234567890';
      const mockRate: Partial<Rate> = { address };
      const updatedRate: Rate = { id: 1, address, eur: 100, usd: 120 };

      jest.spyOn(rateService, 'update').mockResolvedValue(updatedRate);

      const result = await rateController.updateRate(mockRate);

      expect(rateService.update).toHaveBeenCalledWith(mockRate);
      expect(result).toEqual(updatedRate);
    });
  });
});
