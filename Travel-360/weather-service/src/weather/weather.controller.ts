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
    @Body('forecast') forecast: { date: string; tempMin: number; tempMax: number; condition: string }[],
  ) {
    return this.weatherService.addWeather(destination, forecast);
  }
}
