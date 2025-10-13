import { Controller, Get, Query } from '@nestjs/common';
import { AggregatorService } from './aggregator.service';

@Controller('trips')
export class AggregatorController {
  constructor(private readonly aggregatorService: AggregatorService) {}

  @Get('v1/search')
  async searchV1(
    @Query('from') from: string,
    @Query('destination') destination: string,
    @Query('departTime') departTime: string,
  ) {
    return this.aggregatorService.getV1Trips(from, destination, departTime);
  }

  @Get('v2/search')
  async searchV2(
    @Query('from') from: string,
    @Query('destination') destination: string,
    @Query('departTime') departTime: string,
  ) {
    return this.aggregatorService.getV2Trips(from, destination, departTime);
  }
}
