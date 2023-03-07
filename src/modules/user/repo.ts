import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserEntity } from './entity';
import { UserDocument } from './schema';
@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(UserEntity.name)
    private model: Model<UserDocument>,
  ) {}

  async create(entity: UserEntity): Promise<UserDocument> {
    return this.model.create(entity.toDto());
  }

  async findAll(): Promise<UserDocument[]> {
    return this.model.find().lean<UserDocument[]>();
  }

  async findByUsername(username: string): Promise<UserDocument> {
    return this.model
      .findOne({
        username,
      })
      .lean<UserDocument>();
  }
}
