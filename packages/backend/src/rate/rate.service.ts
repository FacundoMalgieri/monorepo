import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { getETHRate } from 'api/coingecko';

import { Rate } from './rate.entity';

@Injectable()
export class RateService {
  constructor(
    @InjectRepository(Rate)
    private readonly rateRepository: Repository<Rate>,
  ) {}

  async findRate(address: string): Promise<Rate> {
    const rate = await this.rateRepository.findOne({ where: { address } });
    if (!rate) {
      const coinGeckoRates = await getETHRate();
      const defaultRate = { id: null, ...coinGeckoRates, address };
      return await this.rateRepository.save(defaultRate);
    }

    return rate;
  }

  async update(rateData?: Partial<Rate>): Promise<Rate> {
    let payload = { ...rateData };

    if (rateData.eur === 0 || rateData.usd === 0) {
      const coinGeckoRates = await getETHRate();
      const defaultRate =
        rateData.eur === 0
          ? { eur: coinGeckoRates.eur }
          : { usd: coinGeckoRates.usd };
      payload = { ...rateData, ...defaultRate };
    }

    await this.rateRepository.update({ address: rateData.address }, payload);
    return await this.rateRepository.findOne({
      where: { address: rateData.address },
    });
  }
}
