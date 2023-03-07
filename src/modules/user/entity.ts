import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { UserDocument } from './schema';

export interface IUser {
  _id?: ObjectId | string;
  uuid: string;
  username: string;
  createAt: Date;
  updateAt: Date;
}

@ObjectType()
@Schema()
export class UserEntity implements IUser {
  @Prop()
  name: 'user';

  @Prop({ type: String, index: true })
  @Field(() => String)
  uuid: string;

  @Prop({ type: String, index: true })
  @Field(() => String)
  username: string;

  @Prop({ type: Date, default: Date.now() })
  @Field(() => Date)
  createAt: Date;

  @Prop({ type: Date, default: Date.now() })
  @Field(() => Date)
  updateAt: Date;

  constructor(data: IUser) {
    this.uuid = data.uuid;
    this.username = data.username;
    this.createAt = data.createAt || new Date();
    this.updateAt = data.updateAt || new Date();
  }

  toDto(): IUser {
    return {
      uuid: this.uuid,
      username: this.username,
      createAt: this.createAt,
      updateAt: this.updateAt,
    };
  }

  static fromGG(data: IUser): UserEntity {
    const entity = new UserEntity(data);
    entity.uuid = entity.uuid || uuid();

    return entity;
  }

  static fromMongoDb(car: UserDocument): UserEntity {
    if (!car) return null;
    return new UserEntity(car);
  }
}
