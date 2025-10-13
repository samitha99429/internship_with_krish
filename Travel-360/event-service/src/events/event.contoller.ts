import { Controller, Get, Post, Query } from '@nestjs/common';
import { EventService } from './event.service';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  logEvent(@Query('version') version: string) {
    if (!version) return { message: 'Please provide a version v1 or v2' };
    this.eventService.logEvent(version);
    return { message: `Logged ${version} request` };
  }

  @Get('metrics')
  getMetrics() {
    return this.eventService.getMetrics();
  }
}
