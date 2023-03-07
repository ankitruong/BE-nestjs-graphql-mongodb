import { Field, InputType, OmitType, PickType } from '@nestjs/graphql';
import { CarDetailsEntity, ICarDetails } from '../../car-details/entity';
import { CarEntity } from '../entity';

@InputType()
class GqlCreateCarDetails extends PickType(
  CarDetailsEntity,
  ['date', 'price'],
  InputType,
) {}

@InputType()
export class GqlCreateCarDto extends PickType(
  CarEntity,
  ['model', 'carName'],
  InputType,
) {
  @Field(() => [GqlCreateCarDetails], { nullable: true })
  carDetails: Partial<ICarDetails>[];
}

@InputType()
export class GqlActiveCarDto extends OmitType(CarEntity, ['carDetails']) {
  @Field(() => [GqlCreateCarDetails])
  carDetails: Partial<ICarDetails>[];

  @Field(() => String)
  carId: string;
}
