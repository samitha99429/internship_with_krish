import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class WeatherService {
  private filePath: string;
  private weatherData: Record<string, any> = {};

  constructor() {
    this.filePath = path.join(process.cwd(), 'src', 'weather', 'weather-data.json');
    this.loadData();
  }

  private loadData() {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify({}, null, 2));
    }
    const file = fs.readFileSync(this.filePath, 'utf8');
    this.weatherData = JSON.parse(file);
  }

  private saveData() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.weatherData, null, 2));
  }

  async getWeather(destination: string) {
    const delayMs = parseInt(process.env.WEATHER_DELAY_MS ?? '0'); 
const failRate = parseFloat(process.env.WEATHER_FAIL_RATE ?? '0'); // default to '0' if undefined


    //simulate delay
    if (delayMs > 0) {
      await new Promise((res) => setTimeout(res, delayMs));
    }

    //simulate random failure
    if (Math.random() < failRate) {
      throw new Error('Simulated weather service failure');
    }

    return (
      this.weatherData[destination] || {
        message: 'No weather data available for this destination',
      }
    );
  }

  addWeather(destination: string, forecast: any[]) {
    this.weatherData[destination] = { forecast };
    this.saveData();
    return { message: 'Weather forecast added successfully!' };
  }
}
