import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HotelsModule } from './hotels/hotels.module';
import { Hotel } from './hotels/hotel.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'hotels.db',
      entities: [Hotel],
      synchronize: true,
    }),
    HotelsModule,
  ],
})
export class AppModule {}
