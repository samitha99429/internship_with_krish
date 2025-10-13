

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Flight } from './flight.entity';
import { CreateFlightDto } from './dto/flight.create.dto';
import { SearchFlightDto } from './dto/flight.search.dto';

@Injectable()                    //can be shared inside the nest js
export class FlightsService {
  constructor(
    @InjectRepository(Flight)
    private flightRepo: Repository<Flight>,
  ) {}

  async getAllFlights() {
    return await this.flightRepo.find();
  }

  async createFlight(createFlightDto: CreateFlightDto) {
    const newFlight = this.flightRepo.create(createFlightDto);   //tunr plain object into the entitu object
    return await this.flightRepo.save(newFlight);
  }

  async searchFlights(searchFlightDto: SearchFlightDto): Promise<Flight[]> {
    const { from, destination, departTime } = searchFlightDto;
    return this.flightRepo.find({
      where: { from, destination, departTime },
    });
  }
}

