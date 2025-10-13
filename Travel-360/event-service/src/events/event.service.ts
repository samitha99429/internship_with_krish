import { Injectable } from '@nestjs/common';

@Injectable()
export class EventService {
  private metrics = {
    v1Requests: 0,
    v2Requests: 0,
  };

  logEvent(version: string) {
    if (version === 'v1') this.metrics.v1Requests++;
    else if (version === 'v2') this.metrics.v2Requests++;
  }

  getMetrics() {
    return {
      total: this.metrics.v1Requests + this.metrics.v2Requests,
      ...this.metrics,
    };
  }
}
