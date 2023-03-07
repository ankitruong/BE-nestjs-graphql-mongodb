import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

import { Injectable } from '@nestjs/common';
import { configService } from '../configs/service';
import { IUser } from '../modules/user/entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: configService.GOOGLE_CLIENT_ID,
      clientSecret: configService.GOOGLE_SECRET,
      callbackURL: `${configService.DOMAIN_URI}/google/redirect`,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { emails } = profile;
    const user: Partial<IUser> = {
      username: emails[0].value,
    };

    done(null, user);
  }
}
