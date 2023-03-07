import { Injectable } from '@nestjs/common';
import { CarDetailsService } from '../car-details/service';
import { CarEntity } from './entity';
import { CarRepository } from './repo';

@Injectable()
export class CarService {
  constructor(
    private readonly repository: CarRepository,
    private readonly carDetailsService: CarDetailsService,
  ) {}

  async create(data: CarEntity) {
    const checkExists = await this.repository.findOneByCondition({
      carName: data.carName,
      model: data.model,
      username: data.username,
    });
    if (checkExists) {
      return CarEntity.fromMongoDb(checkExists);
    }

    const result = await this.repository.create(data);
    return CarEntity.fromMongoDb(result);
  }

  async findByUuid(uuid: string): Promise<CarEntity> {
    const car = await this.repository.findByUuid(uuid);
    return CarEntity.fromMongoDb(car);
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
