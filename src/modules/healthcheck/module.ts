import { DynamicModule, Module } from '@nestjs/common';
import { HealthcheckController } from './controller';

@Module({})
export class HealthcheckModule {
  static register(): DynamicModule {
    return {
      module: HealthcheckModule,
      controllers: [HealthcheckController],
    };
  }
}
