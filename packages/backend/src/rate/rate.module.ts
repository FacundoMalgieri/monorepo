import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RateController } from './rate.controller';
import { RateService } from './rate.service';
import { Rate } from './rate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rate])],
  controllers: [RateController],
  providers: [RateService],
  exports: [RateService],
})
export class RateModule {}
