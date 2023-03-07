import { Query, Resolver } from '@nestjs/graphql';
import { configService } from '../../configs/service';
import { UserEntity } from './entity';
import { UserService } from './service';

@Resolver(UserEntity)
export class UserResolver {
  constructor(private readonly service: UserService) {}
  @Query(() => UserEntity, { nullable: true })
  async getUserDefault(): Promise<UserEntity> {
    return this.service.create(
      UserEntity.fromGG({
        username: configService.DEFAULT_USERNAME,
      }),
    );
  }
}
