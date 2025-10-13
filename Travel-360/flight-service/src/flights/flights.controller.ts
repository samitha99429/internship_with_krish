
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { CreateFlightDto } from './dto/flight.create.dto';
import { SearchFlightDto } from './dto/flight.search.dto';

@Controller('flights')                                         
export class FlightsController {
  constructor(private flightService: FlightsService) {}       //automatically injects the flightservice instance into the controller

  @Get()
  getAllFlights() {
    return this.flightService.getAllFlights();
  }

  @Post()
  createFlight(@Body() createFlightDto: CreateFlightDto) {        //json body map with the dto and send to service
    return this.flightService.createFlight(createFlightDto);
  }

  @Get('search')
  async searchFlights(@Query() searchFlightDto: SearchFlightDto) {
    return this.flightService.searchFlights(searchFlightDto);
  }
}
