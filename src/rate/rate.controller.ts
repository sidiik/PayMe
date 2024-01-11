import { Body, Controller, Get, Post } from '@nestjs/common';
import { RateService } from './rate.service';
import { RateDto, getRateDto, setRateDto } from './rate.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';

@Serialize(RateDto)
@Controller('rate')
export class RateController {
  constructor(private readonly rateService: RateService) {}

  @Post('set')
  setRate(@Body() rateData: setRateDto) {
    return this.rateService.setRate(rateData);
  }

  @Get('get')
  getRate(@Body() rateData: getRateDto) {
    return this.rateService.getRate(rateData);
  }
}
