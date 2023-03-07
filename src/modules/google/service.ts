import { Injectable } from '@nestjs/common';
import { UserEntity } from '../user/entity';
import { UserService } from '../user/service';

@Injectable()
export class GGService {
  constructor(private readonly userService: UserService) {}

  async googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }

    const user = await this.userService.create(UserEntity.fromGG(req.user));
    return {
      message: 'User successfully created, please use username for mutation',
      user: user.toDto(),
    };
  }
}
