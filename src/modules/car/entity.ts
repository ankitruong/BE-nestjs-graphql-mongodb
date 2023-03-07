import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';
import { GraphQLError } from 'graphql';
import { ObjectId } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { CarDetailsEntity } from '../car-details/entity';
import { GqlCreateCarDto } from './dtos/gql-create-car';
import { CarDocument } from './schema';

export interface ICar {
  _id?: ObjectId | string;
  uuid: string;
  username: string;
  carName: string;
  model: CAR_MODEL_ENUM;
  createAt: Date;
  updateAt: Date;
}

export enum CAR_MODEL_ENUM {
  MEC = 'MEC',
  BWM = 'BWM',
  TOY = 'TOY',
}

registerEnumType(CAR_MODEL_ENUM, {
  name: 'CAR_MODEL_ENUM',
});

@ObjectType()
@Schema()
export class CarEntity implements ICar {
  @Prop()
  name: 'car';

  @Prop({ type: String, index: true })
  @Field(() => String)
  uuid: string;

  @Prop({ type: String, index: true })
  @Field(() => String)
  username: string;

  @Prop({ type: String })
  @Field(() => String)
  carName: string;

  @Prop({ type: String, index: true })
  @Field(() => CAR_MODEL_ENUM)
  model: CAR_MODEL_ENUM;

  @Prop({ type: Date, default: Date.now() })
  @Field(() => Date)
  createAt: Date;

  @Prop({ type: Date, default: Date.now() })
  @Field(() => Date)
  updateAt: Date;

  @Field(() => [CarDetailsEntity])
  carDetails: CarDetailsEntity[];

  constructor(data: Partial<ICar>) {
    this.uuid = data.uuid;
    this.username = data.username;
    this.model = data.model;
    this.carName = data.carName;
    this.createAt = data.createAt || new Date();
    this.updateAt = data.updateAt || new Date();
  }

  toDto() {
    return {
      uuid: this.uuid,
      username: this.username,
      model: this.model,
      carName: this.carName,
      createAt: this.createAt,
      updateAt: this.updateAt,
    };
  }

  static fromCreateGql(car: GqlCreateCarDto, username: string): CarEntity {
    if (!username || !car.model || !car.carName) {
      throw new GraphQLError('Missing params');
    }
    const entity = new CarEntity({
      uuid: uuid(),
      username,
      carName: car.carName,
      model: car.model,
    });

    return entity;
  }

  static fromMongoDb(car: CarDocument): CarEntity {
    if (!car) return null;
    return new CarEntity(car);
  }
}
