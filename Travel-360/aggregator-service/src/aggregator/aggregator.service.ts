import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AggregatorService {
  private readonly logger = new Logger(AggregatorService.name);

  // Helper function for timeout
  private async callWithTimeout(promise, timeoutMs: number, label: string) {
    return Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`${label} timeout after ${timeoutMs}ms`)), timeoutMs),
      ),
    ]);
  }

  // v1
  async getV1Trips(from: string, destination: string, departTime: string) {
    this.logger.log('Scatter gather request received');

    let flightsData = null;
    let hotelsData = null;
    let degraded = false;

    const flightPromise = this.callWithTimeout(
      axios.get('http://localhost:3001/flights/search', {
        params: { from, destination, departTime },
      }),
      1000,
      'Flight service'
    );

    const hotelPromise = this.callWithTimeout(
      axios.get('http://localhost:3002/hotels/search', {
        params: { destination },
      }),
      1000,
      'Hotel service'
    );

    try {
      const [flightsRes, hotelsRes] = await Promise.allSettled([flightPromise, hotelPromise]);

      if (flightsRes.status === 'fulfilled') {
        flightsData = flightsRes.value.data;
      } else {
        this.logger.warn(`Flight service failed: ${flightsRes.reason.message}`);
        degraded = true;
      }

      if (hotelsRes.status === 'fulfilled') {
        hotelsData = hotelsRes.value.data;
      } else {
        this.logger.warn(`Hotel service failed: ${hotelsRes.reason.message}`);
        degraded = true;
      }

      this.logger.log('Scatter–gather completed');
      return { flights: flightsData, hotels: hotelsData, degraded };
    } catch (error) {
      this.logger.error('Scatter–gather failed', error.message);
      return { error: 'Aggregator failed', degraded: true };
    }
  }

  //v2 
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


  //Chaining
async getCheapestRoute(from: string, destination: string, departTime: string) {
  this.logger.log('Chaining request for  cheapest route');

  try {
    //Get all flights
    const flightsRes = await this.callWithTimeout(
      axios.get('http://localhost:3001/flights/search', { params: { from, destination, departTime } }),
      2000,
      'Flight service'
    );

    const flights: any[] = flightsRes.data;

    if (!flights || flights.length === 0) {
      return { error: 'No flights available' };
    }

    //Find the cheapest flight
    let cheapestFlight = flights[0];
    for (const f of flights) {
      if (f.price < cheapestFlight.price) cheapestFlight = f;
    }

    this.logger.log(`Cheapest flight found: ${cheapestFlight.id} arriving at ${cheapestFlight.arriveTime}`);

    //Call hotel service with lateCheckInAvailable = true
    const hotelsRes = await this.callWithTimeout(
      axios.get('http://localhost:3002/hotels/search', { params: { destination } }),
      2000,
      'Hotel service'
    );

    const hotels: any[] = hotelsRes.data;

    // Pick first hotel that supports late check-in
    const hotel = hotels.find((h) => h.lateCheckInAvailable === true) || hotels[0];

    return {
      flight: cheapestFlight,
      hotel,
    };
  } catch (error) {
    this.logger.error('Chaining failed', error.message);
    return { error: 'Aggregator chaining failed' };
  }
}


}



