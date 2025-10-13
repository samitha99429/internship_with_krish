import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  getWeather(@Query('destination') destination: string) {
    return this.weatherService.getWeather(destination);
  }

  @Post()
  addWeather(
    @Body('destination') destination: string,
    @Body('temperature') temperature: string,
    @Body('condition') condition: string,
  ) {
    return this.weatherService.addWeather(destination, temperature, condition);
  }
}
