import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { CarDetailsModule } from '../modules/car-details/module';
import { CarDetailsResolver } from '../modules/car-details/resolver';
import { CarModule } from '../modules/car/module';
import { CarResolver } from '../modules/car/resolver';
import { UserModule } from '../modules/user/module';
import { AuthorGuard } from './guards';

@Module({
  imports: [CarModule, CarDetailsModule, UserModule],
  providers: [
    CarResolver,
    CarDetailsResolver,
    {
      provide: APP_GUARD,
      useClass: AuthorGuard,
    },
  ],
  controllers: [],
  exports: [],
})
export class GqlModule {}
