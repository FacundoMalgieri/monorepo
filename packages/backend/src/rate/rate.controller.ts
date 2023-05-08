import { Body, Controller, Patch } from '@nestjs/common';

import { Rate } from './rate.entity';
import { RateService } from './rate.service';

@Controller('rate')
export class RateController {
  constructor(private readonly ratesService: RateService) {}

  @Patch()
  async updateRate(@Body() rateData?: Partial<Rate>): Promise<Rate> {
    return this.ratesService.update(rateData);
  }
}
