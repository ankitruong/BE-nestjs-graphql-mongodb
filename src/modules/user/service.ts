import { Injectable } from '@nestjs/common';
import { UserEntity } from './entity';
import { UserRepository } from './repo';

@Injectable()
export class UserService {
  constructor(private repository: UserRepository) {}

  async create(data: UserEntity): Promise<UserEntity> {
    const checkExists = await this.repository.findByUsername(data.username);
    if (checkExists) {
      return UserEntity.fromMongoDb(checkExists);
    }

    const result = await this.repository.create(data);
    return UserEntity.fromMongoDb(result);
  }

  async findByUsername(
    username: string,
  ): Promise<UserEntity | Partial<UserEntity>> {
    const result = await this.repository.findByUsername(username);
    return UserEntity.fromMongoDb(result);
  }
}
