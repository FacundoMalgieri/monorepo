import { Test, TestingModule } from '@nestjs/testing';
import { mockDeep, MockProxy } from 'jest-mock-extended';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as coingecko from 'api/coingecko';

import { RateService } from './rate.service';
import { Rate } from './rate.entity';

describe('RateService', () => {
  const address = '0x1234567890123456789012345678901234567890';
  let module: TestingModule;
  let service: RateService;
  let rateRepository: MockProxy<Repository<Rate>>;

  beforeEach(async () => {
    jest.clearAllMocks();

    module = await Test.createTestingModule({
      providers: [
        RateService,
        {
          provide: getRepositoryToken(Rate),
          useFactory: () => mockDeep(Repository),
        },
      ],
    }).compile();

    service = module.get<RateService>(RateService);
    rateRepository = module.get<MockProxy<Repository<Rate>>>(
      getRepositoryToken(Rate),
    );
  });

  afterAll(async () => {
    await module.close();
  });

  describe('findRate', () => {
    it('should return rate from rateRepository when it exists', async () => {
      const rate = { id: 1, address, eur: 10, usd: 20 };
      jest.spyOn(rateRepository, 'findOne').mockResolvedValueOnce(rate);

      const result = await service.findRate(address);

      expect(rateRepository.findOne).toHaveBeenCalledWith({
        where: { address },
      });
      expect(result).toEqual(rate);
    });

    it('should save and return default rate when rate does not exist in rateRepository', async () => {
      const coinGeckoRates = { eur: 10, usd: 20 };
      const getETHRateSpy = jest.spyOn(coingecko, 'getETHRate');

      jest.spyOn(rateRepository, 'findOne').mockResolvedValueOnce(null);
      getETHRateSpy.mockResolvedValueOnce(coinGeckoRates);
      jest
        .spyOn(rateRepository, 'save')
        .mockResolvedValueOnce({ id: 1, address, ...coinGeckoRates });

      const result = await service.findRate(address);

      expect(rateRepository.findOne).toHaveBeenCalledWith({
        where: { address },
      });
      expect(getETHRateSpy).toHaveBeenCalled();
      expect(rateRepository.save).toHaveBeenCalledWith({
        id: null,
        address,
        ...coinGeckoRates,
      });
      expect(result).toEqual({ id: 1, address, ...coinGeckoRates });
    });
  });
});
