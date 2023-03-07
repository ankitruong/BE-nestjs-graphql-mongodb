import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CarDetailsEntity } from '../car-details/entity';
import { CarDetailsService } from '../car-details/service';
import { GqlCreateCarDto } from './dtos/gql-create-car';
import { CarEntity } from './entity';
import { CarService } from './service';

@Resolver(CarEntity)
export class CarResolver {
  constructor(
    private readonly service: CarService,
    private readonly carDetailsService: CarDetailsService,
  ) {}

  @Query(() => CarEntity, { nullable: true })
  async getCarByUuid(@Args('uuid') uuid: string): Promise<CarEntity> {
    return this.service.findByUuid(uuid);
  }

  @ResolveField('carDetails', () => [CarDetailsEntity], { nullable: true })
  async getCarInfo(@Parent() car: CarEntity): Promise<CarDetailsEntity[]> {
    const { uuid, carDetails } = car;
    if (carDetails?.length) {
      return carDetails;
    }
    return this.carDetailsService.findByCarId(uuid);
  }

  @Mutation(() => [CarEntity])
  async createCars(
    @Args({ name: 'username', type: () => String })
    username: string,
    @Args({ name: 'cars', type: () => [GqlCreateCarDto] })
    cars: GqlCreateCarDto[],
  ): Promise<CarEntity[]> {
    const result = [];
    for (const car of cars) {
      const { carDetails } = car;
      const entity = await this.service.create(
        CarEntity.fromCreateGql(car, username),
      );
      if (carDetails?.length) {
        const carDetailsEntities = [];
        for (const details of carDetails) {
          const { date, price } = details;
          const carDetailEntity = await this.carDetailsService.create(
            CarDetailsEntity.init({
              carInfo: {
                uuid: entity.uuid,
                model: entity.model,
              },
              createdBy: username,
              date,
              price,
            }),
          );
          carDetailsEntities.push(carDetailEntity);
        }
        entity.carDetails = carDetailsEntities;
      }
      result.push(entity);
    }
    return result;
  }

  @Mutation(() => Boolean)
  async removeByUsername(
    @Args({ name: 'username', type: () => String })
    username: string,
  ): Promise<Boolean> {
    return this.service.removeByUsername(username);
  }
}
