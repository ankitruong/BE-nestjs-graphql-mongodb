import { Injectable } from '@nestjs/common';
import { FilterParams } from './dtos/filter.dto';
import { CarDetailsEntity } from './entity';
import { CarDetailsRepository } from './repo';

@Injectable()
export class CarDetailsService {
  constructor(private repository: CarDetailsRepository) {}

  async create(data: CarDetailsEntity) {
    const result = await this.repository.findOneAndUpdate(data);
    return CarDetailsEntity.fromMongoDb(result);
  }

  async createMany(entities: CarDetailsEntity[]) {
    const result = await this.repository.createMany(entities);
    return result.map(CarDetailsEntity.fromMongoDb);
  }

  async findByUsername(username: string) {
    const result = await this.repository.findByUsername(username);
    return CarDetailsEntity.fromMongoDb(result);
  }

  async findByCondition(query: FilterParams) {
    const condition = this._prepareCondition(query);
    const result = await this.repository.findByCondition(condition);
    return result.map(CarDetailsEntity.fromMongoDb);
  }

  private _prepareCondition(query: FilterParams) {
    const condition: {
      date?: any;
      price?: any;
      model?: any;
      createdBy?: any;
    } = {};

    if (query.fromDate || query.toDate) {
      condition.date = {};
      query.fromDate && (condition.date.$gte = query.fromDate);
      query.toDate && (condition.date.$lte = query.toDate);
    }

    if (query.fromPrice || query.toPrice) {
      condition.price = {};
      query.fromPrice && (condition.price.$gte = query.fromPrice);
      query.toPrice && (condition.price.$lte = query.toPrice);
    }

    if (query.models?.length) {
      condition.model = { $in: query.models };
    }

    if (query.owners?.length) {
      condition.createdBy = { $in: query.owners };
    }

    return condition;
  }

  async findByCarId(uuid: string) {
    const result = await this.repository.findByCarId(uuid);
    return result.map(CarDetailsEntity.fromMongoDb);
  }

  async removeByUsername(username: string): Promise<boolean> {
    await this.repository.removeByUsername(username);
    return true;
  }
}
