import { Module } from '@nestjs/common';
import { WeatherModule } from './weather/weather.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [WeatherModule,
     ConfigModule.forRoot({
      isGlobal: true, // so you can access process.env everywhere
    }),
  ],
})
export class AppModule {}
