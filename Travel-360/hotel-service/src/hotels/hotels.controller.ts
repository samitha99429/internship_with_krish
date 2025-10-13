
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { CreateHotelDto } from './dto/hotel.create.dto';
import { SearchHotelDto } from './dto/hotel.search.dto';

@Controller('hotels')
export class HotelsController {
  constructor(private hotelService: HotelsService) {}

  @Get()
  getAllHotels() {
    return this.hotelService.getAllHotels();
  }

  @Post()
  createHotel(@Body() createHotelDto: CreateHotelDto) {
    return this.hotelService.createHotel(createHotelDto);
  }

  @Get('search')
  async searchHotels(@Query() searchHotelDto: SearchHotelDto) {
    return this.hotelService.searchHotels(searchHotelDto);
  }
}
