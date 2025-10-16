import { Injectable } from '@nestjs/common';

@Injectable()
export class EventService {
  private events = [
    { destination: 'CMB', event: 'Beach Festival', date: '2025-12-10' },
    { destination: 'BKK', event: 'Full Moon Party', date: '2025-12-11' },
    { destination: 'HKT', event: 'Seafood Carnival', date: '2025-12-12' },
  ];

  //filter by destination
  findByDestination(destination: string) {
    return this.events.filter(e => e.destination === destination);
  }
}
