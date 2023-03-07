import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GraphQLError } from 'graphql';
import { ObjectId } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { FormatDate } from '../../shared/utils';
import { CarEntity, CAR_MODEL_ENUM } from '../car/entity';
import { CarDetailsDocument } from './schema';

export interface ICarDetails {
  _id?: ObjectId | string;
  uuid?: string;
  carInfo: {
    uuid: string;
    model: CAR_MODEL_ENUM;
  };
  date: string;
  price: number; //price per date
  createdBy?: string;
  createAt?: Date;
  updateAt?: Date;
}

@Schema()
export class CarInfo {
  @Prop()
  uuid: string;

  @Prop()
  model: CAR_MODEL_ENUM;
}
const CarInfoSchema = SchemaFactory.createForClass(CarInfo);

@ObjectType()
@Schema()
export class CarDetailsEntity implements ICarDetails {
  @Prop()
  name: 'carDetails';

  @Prop({ type: String, index: true })
  @Field(() => String)
  uuid: string;

  @Prop({ type: CarInfoSchema, index: true })
  @Field(() => CarEntity)
  carInfo: ICarDetails['carInfo'];

  @Prop({ type: String, index: true })
  @Field(() => String)
  createdBy: string;

  @Prop({ type: String, index: true })
  @Field(() => Date)
  date: string;

  @Prop({ type: Number })
  @Field(() => Int)
  price: number;

  @Prop({ type: Date, default: Date.now() })
  @Field(() => Date)
  createAt: Date;

  @Prop({ type: Date, default: Date.now() })
  @Field(() => Date)
  updateAt: Date;

  constructor(data: ICarDetails) {
    if (!data.createdBy) {
      throw new GraphQLError('Missing params');
    }

    this.uuid = data.uuid;
    this.carInfo = data.carInfo;
    this.date = FormatDate(data.date);
    this.price = data.price;
    this.createdBy = data.createdBy;

    this.createAt = data.createAt || new Date();
    this.updateAt = data.updateAt || new Date();
  }

  toDto() {
    return {
      uuid: this.uuid,
      carInfo: this.carInfo,
      date: this.date,
      price: this.price,
      createdBy: this.createdBy,
      createAt: this.createAt,
      updateAt: this.updateAt,
    };
  }

  static init(data: ICarDetails): CarDetailsEntity {
    const entity = new CarDetailsEntity(data);
    entity.uuid = entity.uuid || uuid();

    return entity;
  }

  static fromMongoDb(data: CarDetailsDocument): CarDetailsEntity {
    if (!data) return null;
    return new CarDetailsEntity(data);
  }
}
