import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AggregatorService {
  private readonly logger = new Logger(AggregatorService.name);

  // v1 aggregator version 1 Flights + Hotels
  async getV1Trips(from: string, destination: string, departTime: string) {
    try {
      const [flightsRes, hotelsRes] = await Promise.all([
        axios.get('http://localhost:3001/flights/search', {
          params: { from, destination, departTime },
        }),
        axios.get('http://localhost:3002/hotels/search', {
          params: { destination },
        }),
      ]);

      this.logger.log(' V1 trip search executed successfully');

      return {
        flights: flightsRes.data,
        hotels: hotelsRes.data,
      };
    } catch (error) {
      this.logger.error('V1 trip search failed', error.message);
      return { error: 'V1 aggregator failed' };
    }
  }

  // v2 aggregator version 2 Flights + Hotels + Weather
  async getV2Trips(from: string, destination: string, departTime: string) {
    try {
      const [flightsRes, hotelsRes, weatherRes] = await Promise.all([
        axios.get('http://localhost:3001/flights/search', {
          params: { from, destination, departTime },
        }),
        axios.get('http://localhost:3002/hotels/search', {
          params: { destination },
        }),
        axios.get('http://localhost:3003/weather', {
          params: { destination },
        }),
      ]);

      this.logger.log('V2 trip search executed successfully');

      return {
        flights: flightsRes.data,
        hotels: hotelsRes.data,
        weather: weatherRes.data,
      };
    } catch (error) {
      this.logger.error('V2 trip search failed', error.message);
      return { error: 'V2 aggregator failed' };
    }
  }
}



