import { Controller, Get, Query } from '@nestjs/common';
import { EventService } from './event.service';

@Controller('events')
export class EventController {
  constructor(private readonly eventsService: EventService) {}

  @Get('search')
  findEvents(@Query('destination') destination: string) {
    return this.eventsService.findByDestination(destination);
  }
}
