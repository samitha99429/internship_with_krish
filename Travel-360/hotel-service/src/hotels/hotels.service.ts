import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hotel } from './hotel.entity';
import { CreateHotelDto } from './dto/hotel.create.dto';
import { SearchHotelDto } from './dto/hotel.search.dto';

@Injectable()
export class HotelsService {
  constructor(
    @InjectRepository(Hotel)
    private hotelRepo: Repository<Hotel>,
  ) {}

  async getAllHotels() {
    return await this.hotelRepo.find();
  }

  async createHotel(createHotelDto: CreateHotelDto) {
    const newHotel = this.hotelRepo.create(createHotelDto);
    return await this.hotelRepo.save(newHotel);
  }

  // async searchHotels(searchHotelDto: SearchHotelDto): Promise<Hotel[]> {
  //   const { destination } = searchHotelDto;
  //   return this.hotelRepo.find({ where: { destination } });
  // }

  async searchHotels(searchHotelDto: SearchHotelDto): Promise<Hotel[]> {
  const { destination, lateCheckIn } = searchHotelDto;

 


  const where: any = { destination };
  if (lateCheckIn) {
                                                   //filter hotels that have lateCheckInAvailable = true
    where.lateCheckInAvailable = true;
  }

  return this.hotelRepo.find({ where });
}

}
