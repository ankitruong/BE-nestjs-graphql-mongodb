import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GraphQLError } from 'graphql';
import { Model } from 'mongoose';
import { CarDetailsEntity } from './entity';
import { CarDetailsDocument } from './schema';
@Injectable()
export class CarDetailsRepository {
  constructor(
    @InjectModel(CarDetailsEntity.name)
    private model: Model<CarDetailsDocument>,
  ) {}

  async create(entity: CarDetailsEntity): Promise<CarDetailsDocument> {
    if (!entity) {
      throw new GraphQLError('Missing params');
    }

    return this.model.create(entity.toDto());
  }

  async findOneAndUpdate(
    entity: CarDetailsEntity,
  ): Promise<CarDetailsDocument> {
    if (!entity.carInfo) {
      throw new GraphQLError('Missing params');
    }
    const data = entity.toDto();
    return this.model.findOneAndUpdate(
      {
        'carInfo.uuid': data.carInfo.uuid,
        date: data.date,
      },
      data,
      { upsert: true, new: true },
    );
  }

  async createMany(
    entities: CarDetailsEntity[],
  ): Promise<CarDetailsDocument[]> {
    if (!entities?.length) {
      throw new GraphQLError('Missing params');
    }

    return this.model.create(entities.map((e) => e.toDto()));
  }

  async findByIds(uuids: string[]) {
    if (!uuids?.length) {
      return;
    }

    return this.model.find({
      uuid: { $in: [...new Set(uuids)] },
    });
  }

  async findByCarId(carId: string): Promise<CarDetailsDocument[]> {
    return this.model
      .find({
        'carInfo.uuid': carId,
      })
      .lean<CarDetailsDocument[]>();
  }

  async findByUsername(username: string): Promise<CarDetailsDocument> {
    return this.model
      .findOne({
        createdBy: username,
      })
      .lean<CarDetailsDocument>();
  }

  async findByCondition(condition: {
    date?: any;
    price?: any;
    model?: any;
  }): Promise<CarDetailsDocument[]> {
    if (!Object.keys(condition)?.length) {
      return [];
    }
    return this.model.find(condition).lean<CarDetailsDocument[]>();
  }

  removeByUsername(username: string) {
    return this.model.remove({
      createdBy: username,
    });
  }
}
