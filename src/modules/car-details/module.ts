import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { configService } from '../../configs/service';
import { CarModule } from '../car/module';
import { CarDetailsEntity } from './entity';
import { CarDetailsRepository } from './repo';
import { CarDetailsResolver } from './resolver';
import { CarDetailsSchema } from './schema';
import { CarDetailsService } from './service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: CarDetailsEntity.name, schema: CarDetailsSchema }],
      configService.DB_CHALLENGE_NAME,
    ),
    CarModule,
  ],
  controllers: [],
  providers: [CarDetailsRepository, CarDetailsService, CarDetailsResolver],
  exports: [CarDetailsService],
})
export class CarDetailsModule {}
