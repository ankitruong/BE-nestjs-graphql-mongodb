import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ClientSession, Connection } from 'mongoose';
import { configService } from '../../configs/service';
import { CarDetailsService } from '../car-details/service';
import { GqlCreateCarDto } from './dtos/gql-create-car';
import { CarEntity, CAR_MODEL_ENUM } from './entity';
import { CarRepository } from './repo';

@Injectable()
export class CarService {
  constructor(
    private readonly repository: CarRepository,
    private readonly carDetailsService: CarDetailsService,
    @InjectConnection(configService.DB_CHALLENGE_NAME)
    private readonly connection: Connection,
  ) {}

  async hanldeGqlCreate(data: GqlCreateCarDto, username: string) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const { carDetails } = data;

      const entity = await this.create(
        CarEntity.fromCreateGql(data, username),
        session,
      );

      if (!carDetails?.length) {
        return entity;
      }

      const carDetailsEntities = await this.carDetailsService.hanleGqlCreate(
        entity.uuid,
        entity.model,
        carDetails,
        username,
        session,
      );

      entity.carDetails = carDetailsEntities;
      await session.commitTransaction();
      return entity;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async hanldeGqlActiveCar(
    carId: string,
    model: CAR_MODEL_ENUM,
    carDetails: GqlCreateCarDto['carDetails'],
    username: string,
  ) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const carDetailsEntities = await this.carDetailsService.hanleGqlCreate(
        carId,
        model,
        carDetails,
        username,
        session,
      );
      await session.commitTransaction();
      return carDetailsEntities;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async create(data: CarEntity, session?: ClientSession) {
    const checkExists = await this.repository.findOneByCondition({
      carName: data.carName,
      model: data.model,
      username: data.username,
    });
    if (checkExists) {
      return CarEntity.fromMongoDb(checkExists);
    }

    const result = await this.repository.create(data, session);
    return CarEntity.fromMongoDb(result);
  }

  async findByUuid(uuid: string): Promise<CarEntity> {
    const car = await this.repository.findByUuid(uuid);
    return CarEntity.fromMongoDb(car);
  }

  async findByUuids(uuids: string[]): Promise<CarEntity[]> {
    const cars = await this.repository.findByUuids(uuids);
    return cars.map(CarEntity.fromMongoDb);
  }

  async findByUsername(username: string): Promise<CarEntity[]> {
    const cars = await this.repository.findByUsername(username);
    return cars.map(CarEntity.fromMongoDb);
  }

  async countByUsername(username: string): Promise<number> {
    return this.repository.countByUsername(username);
  }

  async removeByUsername(username: string): Promise<boolean> {
    await this.repository.removeByUsername(username);
    await this.carDetailsService.removeByUsername(username);
    return true;
  }

  async findAllCar(): Promise<CarEntity[]> {
    const Cars = await this.repository.findAll();
    return Cars.map((n) => CarEntity.fromMongoDb(n));
  }
}
