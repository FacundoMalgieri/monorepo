import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { Wallet } from './wallet.entity';
import { WalletService } from './wallet.service';

export type SortType = 'FAV' | 'ASC' | 'DSC';

@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  async findAll(@Query('sort') sort: SortType): Promise<Wallet[]> {
    return this.walletService.findAll(sort);
  }

  @Post()
  async create(@Body() wallet: Wallet): Promise<Wallet> {
    return this.walletService.create(wallet);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() wallet: Wallet,
  ): Promise<Wallet> {
    return this.walletService.update(id, wallet);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.walletService.delete(id);
  }
}
