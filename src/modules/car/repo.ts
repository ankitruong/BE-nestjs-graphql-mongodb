import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClearNilProperties } from '../../shared/utils';
import { CarEntity, ICar } from './entity';
import { CarDocument } from './schema';
@Injectable()
export class CarRepository {
  constructor(
    @InjectModel(CarEntity.name)
    private model: Model<CarDocument>,
  ) {}

  async create(entity: CarEntity): Promise<CarDocument> {
    return this.model.create(entity.toDto());
  }

  async findOneAndUpdate(entity: CarEntity): Promise<CarDocument> {
    return this.model.findOneAndUpdate(
      {
        carName: entity.carName,
        model: entity.model,
        username: entity.username,
      },
      entity.toDto(),
      { upsert: true, new: true },
    );
  }

  async findByUsername(username: string): Promise<CarDocument[]> {
    return this.model
      .find({
        username,
      })
      .lean<CarDocument[]>();
  }

  removeByUsername(username: string) {
    return this.model.remove({
      username,
    });
  }

  countByUsername(username: string) {
    return this.model.count({
      username,
    });
  }

  async findAll(): Promise<CarDocument[]> {
    return this.model.find().lean<CarDocument[]>();
  }

  async findByCondition(condition: Partial<ICar>): Promise<CarDocument[]> {
    return this.model.find(ClearNilProperties(condition)).lean<CarDocument[]>();
  }

  async findOneByCondition(condition: Partial<ICar>): Promise<CarDocument> {
    return this.model
      .findOne(ClearNilProperties(condition))
      .lean<CarDocument>();
  }

  async findByUuid(uuid: string): Promise<CarDocument> {
    return this.model
      .findOne({
        uuid,
      })
      .lean<CarDocument>();
  }
}
