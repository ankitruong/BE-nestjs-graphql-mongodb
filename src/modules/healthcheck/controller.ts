import { Controller, Get } from '@nestjs/common';

@Controller('/xenia/health')
export class HealthcheckController {
  @Get()
  healthcheck(): string {
    return 'OK';
  }
  @Get('/memory')
  memory(): any {
    const { rss, heapTotal, heapUsed } = process.memoryUsage();
    return {
      rss: rss / (1024 * 1024),
      heapTotal: heapTotal / (1024 * 1024),
      heapUsed: heapUsed / (1024 * 1024),
    };
  }
}
