import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Wallet } from './wallet.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}

  async findAll(): Promise<Wallet[]> {
    return this.walletRepository.find();
  }

  async create(wallet: Wallet): Promise<Wallet> {
    return this.walletRepository.save(wallet);
  }

  async update(id: number, wallet: Wallet): Promise<Wallet> {
    await this.walletRepository.update(id, wallet);
    return this.walletRepository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.walletRepository.delete(id);
  }
}
