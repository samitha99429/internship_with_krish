// import { Module } from '@nestjs/common';
// import { FlightsModule } from './flights/flights.module';

// @Module({
//   imports: [FlightsModule],

// })
// export class AppModule {}


import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlightsModule } from './flights/flights.module';
import { Flight } from './flights/flight.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({                 //sqllite connetion
      type: 'sqlite',
      database: 'flights.db',
      entities: [Flight],                   //table structure to use.
      synchronize: true, // auto create tables (ok for development)
    }),
    FlightsModule,             //where the business logic of the fligh service
  ],
})
export class AppModule {}
