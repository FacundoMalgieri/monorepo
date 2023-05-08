import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { getETHBalance } from 'api/etherscan';
import { RateService } from 'rate/rate.service';
import {
  avoidMaxLimitPerSecond,
  findAndWeiToEth,
  getWalletAddresses,
  isValidETHAddress,
  sanitizeAddresses,
  sortBy,
} from 'utils/helpers';

import { Wallet } from './wallet.entity';
import { SortType } from './wallet.controller';

interface ExtendedWallet extends Wallet {
  usd: number;
  eur: number;
  old: boolean;
}

@Injectable()
export class WalletService {
  constructor(
    @Inject(RateService)
    private readonly rateService: RateService,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}

  async extendWallets(wallets: Wallet[]): Promise<ExtendedWallet[]> {
    const walletAddresses = getWalletAddresses(wallets);
    const balanceResult = await getETHBalance(walletAddresses);

    const extendedWallets = wallets?.map(async (wallet) => {
      const rates = await this.rateService.findRate(wallet.address);
      const eth = findAndWeiToEth(balanceResult, wallet.address);

      return {
        ...wallet,
        eth,
        usd: rates.usd,
        eur: rates.eur,
        old: false,
      };
    });

    return await Promise.all(extendedWallets);
  }

  async findAll(sort: SortType): Promise<ExtendedWallet[]> {
    const wallets = await this.walletRepository.find({ order: sortBy(sort) });
    if (!wallets.length) {
      return [];
    }

    await avoidMaxLimitPerSecond();
    return this.extendWallets(sanitizeAddresses(wallets));
  }

  async create(wallet: Wallet): Promise<Wallet> {
    if (!isValidETHAddress(wallet.address)) {
      throw new Error('Invalid ETH address');
    }
    return this.walletRepository.save({ ...wallet });
  }

  async update(id: number, wallet: Wallet): Promise<Wallet> {
    await this.walletRepository.update(id, wallet);
    return this.walletRepository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.walletRepository.delete(id);
  }
}
