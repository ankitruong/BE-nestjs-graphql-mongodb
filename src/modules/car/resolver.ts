import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { CarDetailsEntity } from '../car-details/entity';
import { CarDetailsService } from '../car-details/service';
import { GqlActiveCarDto, GqlCreateCarDto } from './dtos/gql-create-car';
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
      const entity = await this.service.handleGqlCreate(car, username);
      result.push(entity);
    }
    return result;
  }

  @Mutation(() => [CarEntity])
  async activeCars(
    @Args({ name: 'username', type: () => String })
    username: string,
    @Args({ name: 'cars', type: () => [GqlActiveCarDto] })
    cars: GqlActiveCarDto[],
  ): Promise<CarEntity[]> {
    const result = [];
    const carIds = new Set(cars.map((i) => i.carId));
    const entities = await this.service.findByUuids([...carIds]);

    if (!entities.length) {
      throw new GraphQLError('carIds do not exist');
    }

    const entityMapById = new Map<string, CarEntity>();
    entities.forEach((e) => {
      entityMapById.set(e.uuid, e);
    });
    for (const car of cars) {
      const { carDetails, carId } = car;

      const entity = entityMapById.get(carId);
      if (!entity) {
        throw new GraphQLError(`carId ${carId} does not exist`);
      }
      if (entity.username != username) {
        throw new GraphQLError('FORBIDDEN');
      }

      const carDetailsEntities = await this.service.hanldeGqlActiveCar(
        entity.uuid,
        entity.model,
        carDetails,
        username,
      );
      entity.carDetails = carDetailsEntities;
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
