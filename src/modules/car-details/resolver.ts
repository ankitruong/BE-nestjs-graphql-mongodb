import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CarEntity } from '../car/entity';
import { CarService } from '../car/service';
import { FilterParams } from './dtos/filter.dto';
import { CarDetailsEntity } from './entity';
import { CarDetailsService } from './service';

@Resolver(CarDetailsEntity)
export class CarDetailsResolver {
  constructor(
    private readonly service: CarDetailsService,
    private readonly carService: CarService,
  ) {}
  @Query(() => CarDetailsEntity, { nullable: true })
  async getCarDetailsByUsername(
    @Args('username') username: string,
  ): Promise<CarDetailsEntity> {
    return this.service.findByUsername(username);
  }

  @Query(() => [CarDetailsEntity])
  async getAll(
    @Args({ name: 'query', type: () => FilterParams })
    query: FilterParams,
  ): Promise<CarDetailsEntity[]> {
    return this.service.findByCondition(query);
  }

  @ResolveField('carInfo', () => CarEntity)
  async getCarInfo(@Parent() carDetails: CarDetailsEntity): Promise<CarEntity> {
    const { carInfo } = carDetails;
    return this.carService.findByUuid(carInfo.uuid);
  }

  @ResolveField('date', () => Date)
  async getDate(@Parent() carDetails: CarDetailsEntity) {
    const { date } = carDetails;
    return new Date(date);
  }
}
