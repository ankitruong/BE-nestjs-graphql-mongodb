import { Field, InputType, Int } from '@nestjs/graphql';
import { CAR_MODEL_ENUM } from '../../car/entity';

@InputType()
export class FilterParams {
  @Field({ nullable: true })
  fromDate?: string;

  @Field({ nullable: true })
  toDate?: string;

  @Field(() => Int, { nullable: true })
  fromPrice?: number;

  @Field(() => Int, { nullable: true })
  toPrice?: number;

  @Field(() => [CAR_MODEL_ENUM], { nullable: true })
  models?: CAR_MODEL_ENUM[];

  @Field(() => [String], { nullable: true })
  owners?: string[];
}
