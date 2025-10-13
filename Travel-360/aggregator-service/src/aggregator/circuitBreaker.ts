export class CircuitBreaker {
  private failureCount = 0;
  private successThreshold = 1;
  private failureThreshold = 3;
  private timeout = 10000; // 10 seconds
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  canRequest() {
    if (this.state === 'OPEN') {
      console.log('Circuit breaker is open');
      return false;
    }
    return true;
  }

  recordSuccess() {
    if (this.state === 'HALF_OPEN') {
      console.log('half open success  closing circuit');
      this.state = 'CLOSED';
      this.failureCount = 0;
      return;
    }

    if (this.state === 'CLOSED') {
      this.failureCount = 0;
    }
  }

  recordFailure() {
    this.failureCount++;

    if (this.state === 'HALF_OPEN') {
      console.log('halfopen failure reopening circuit');
      this.trip();
      return;
    }

    if (this.failureCount >= this.failureThreshold) {
      console.log('Too many failures so opening circuit');
      this.trip();
    }
  }

  private trip() {
    this.state = 'OPEN';
    console.log('Circuit breaker tripped OPEN');
    setTimeout(() => this.halfOpen(), this.timeout);
  }

  private halfOpen() {
    this.state = 'HALF_OPEN';
    console.log('Circuit breaker is Hlf open');
  }
}
