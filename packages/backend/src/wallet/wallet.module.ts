import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RateModule } from 'rate/rate.module';

import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { Wallet } from './wallet.entity';

@Module({
  imports: [RateModule, TypeOrmModule.forFeature([Wallet])],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
