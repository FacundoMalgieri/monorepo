import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { getETHBalance } from 'api/etherscan';

import { Wallet } from './wallet.entity';
import { SortType } from './wallet.controller';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}

  async findAll(sort: SortType): Promise<Wallet[]> {
    let orderBy;

    if (sort === 'ASC') {
      orderBy = { id: 'ASC' };
    } else if (sort === 'FAV') {
      orderBy = { favorite: 'DESC' };
    } else {
      orderBy = { id: 'DESC' };
    }

    return this.walletRepository.find({ order: orderBy });
  }

  async create(wallet: Wallet): Promise<Wallet> {
    const balance = await getETHBalance(wallet.address);
    return this.walletRepository.save({ ...wallet, balance });
  }

  async update(id: number, wallet: Wallet): Promise<Wallet> {
    await this.walletRepository.update(id, wallet);
    return this.walletRepository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.walletRepository.delete(id);
  }
}
