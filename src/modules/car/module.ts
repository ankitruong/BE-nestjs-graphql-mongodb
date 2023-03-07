import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { configService } from '../../configs/service';
import { CarDetailsModule } from '../car-details/module';
import { CarEntity } from './entity';
import { CarRepository } from './repo';
import { CarResolver } from './resolver';
import { CarSchema } from './schema';
import { CarService } from './service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: CarEntity.name, schema: CarSchema }],
      configService.DB_CHALLENGE_NAME,
    ),
    forwardRef(() => CarDetailsModule),
  ],
  controllers: [],
  providers: [CarRepository, CarService, CarResolver],
  exports: [CarService],
})
export class CarModule {}
