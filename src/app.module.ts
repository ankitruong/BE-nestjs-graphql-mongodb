import { ApolloDriver } from '@nestjs/apollo';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { configService } from './configs/service';
import { GqlModule } from './graphql/module';
import { GqlComplexityPlugin } from './graphql/plugins/complexity';
import { AuthenticationMiddleware } from './middlewares/authentication.middleware';
import { GGModule } from './modules/google/module';
import { HealthcheckModule } from './modules/healthcheck/module';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [GqlModule],
      useFactory: () => ({
        autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
        path: '/xenia/graphql',
        sortSchema: true,
        debug: configService.IS_DEVELOPMENT_MODE,
        playground: true,
      }),
    }),
    MongooseModule.forRoot(configService.DB_URI, {
      connectionName: configService.DB_CHALLENGE_NAME,
      autoIndex: true,
    }),
    GGModule,
    HealthcheckModule.register(),
  ],
  controllers: [],
  providers: [GoogleStrategy, GqlComplexityPlugin],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(AuthenticationMiddleware)
      .forRoutes({ path: '/xenia/*', method: RequestMethod.ALL });
  }
}
