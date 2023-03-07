import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { GqlCreateCarDto } from '../../modules/car/dtos/gql-create-car';
import { CarService } from '../../modules/car/service';
import { UserService } from '../../modules/user/service';

export function isGraphQL(context: ExecutionContext): boolean {
  return context.getType<GqlContextType>() === 'graphql';
}

@Injectable()
export class AuthorGuard implements CanActivate {
  private username: string;
  constructor(
    private reflector: Reflector,
    private readonly userService: UserService,
    private readonly carService: CarService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (isGraphQL(context)) {
      return this.graphqlCanActivate(context);
    }

    return true;
  }

  async graphqlCanActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);

    const args = ctx.getArgs();
    const action = context.getHandler().name;

    if (action === 'createCars') {
      return this.createCarGuard(args['username'], args['cars']);
    }

    return true;
  }

  async createCarGuard(
    username: string,
    data: GqlCreateCarDto[],
  ): Promise<boolean> {
    if (!username) {
      throw new GraphQLError('username is required');
    }
    const isValid = await this.userService.findByUsername(username);
    if (!isValid) {
      throw new GraphQLError(
        'FORBIDDEN. Please, read on the document to register for an account',
      );
    }

    const totalCars = await this.userService.findByUsername(username);
    if (totalCars > 50) {
      throw new GraphQLError('Maximum 50 car per user, please delete');
    }

    if (data?.length > 10) {
      throw new GraphQLError('Maximum 10 car per request');
    }

    data?.forEach((d) => {
      if (d.carDetails?.length > 10) {
        throw new GraphQLError('Maximum 10 details per car');
      }
    });

    return true;
  }
}
