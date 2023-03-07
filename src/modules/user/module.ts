import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { configService } from '../../configs/service';
import { UserEntity } from './entity';
import { UserRepository } from './repo';
import { UserResolver } from './resolver';
import { UserSchema } from './schema';
import { UserService } from './service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: UserEntity.name, schema: UserSchema }],
      configService.DB_CHALLENGE_NAME,
    ),
  ],
  controllers: [],
  providers: [UserRepository, UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
