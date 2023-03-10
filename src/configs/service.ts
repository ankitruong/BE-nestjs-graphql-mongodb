import { Global } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as _ from 'lodash';

@Global()
export class ConfigService {
  constructor() {
    dotenv.config({
      path: process.env.ENV_PATH
        ? `${__dirname}/../../${process.env.ENV_PATH}`
        : `${__dirname}/../../.env`,
    });
  }

  get IS_DEVELOPMENT_MODE(): boolean {
    return _.toLower(process.env.IS_DEVELOPMENT_MODE) === 'true';
  }

  get PORT(): number {
    return Number(process.env.PORT) || 3000;
  }

  get DOMAIN_URI(): string {
    return process.env.DOMAIN_URI || 'http://localhost:3000';
  }

  get DB_URI(): string {
    return (
      process.env.DB_URI || 'mongodb://localhost:54322/challenge?replicaSet=rs'
    );
  }

  get DB_CHALLENGE_NAME(): string {
    return _.toLower(process.env.DB_CHALLENGE_NAME) || 'challenge';
  }

  get BODY_SIZE_LIMIT(): string {
    return process.env.BODY_SIZE_LIMIT || '2mb';
  }

  get GOOGLE_CLIENT_ID(): string {
    return process.env.GOOGLE_CLIENT_ID;
  }

  get GOOGLE_SECRET(): string {
    return process.env.GOOGLE_SECRET;
  }

  get DEFAULT_USERNAME(): string {
    return 'anki.truong98@gmail.com';
  }
}

export const configService = new ConfigService();
