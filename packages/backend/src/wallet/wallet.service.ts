import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { getETHBalance, getFirstTxTimestamp } from 'api/etherscan';
import { RateService } from 'rate/rate.service';
import {
  findAndWeiToEth,
  getWalletAddresses,
  isOlderThanOneYear,
  isValidETHAddress,
  sanitizeAddresses,
  sortBy,
} from 'utils/helpers';

import { Wallet } from './wallet.entity';
import { SortType } from './wallet.controller';

export interface ExtendedWallet extends Wallet {
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
      const { address } = wallet;
      const rates = await this.rateService.findRate(address);
      const timestamp = await getFirstTxTimestamp(address);
      const old = isOlderThanOneYear(timestamp);
      const eth = findAndWeiToEth(balanceResult, address);

      return {
        ...wallet,
        eth,
        usd: rates.usd,
        eur: rates.eur,
        old,
      };
    });

    return await Promise.all(extendedWallets);
  }

  async findAll(sort: SortType): Promise<ExtendedWallet[]> {
    const wallets = await this.walletRepository.find({ order: sortBy(sort) });
    if (!wallets.length) {
      return [];
    }

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
