/* eslint-disable */
import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Hotel } from '../entities/hotel.entity';

@InputType()
export class CreateHotelInput extends PickType(Hotel, [
  'nickname',
  'description',
  'headColor',
  'bodyColor',
  'windows',
]) {
  /* @Field(type => String)
  categoryName: string; */
}

@ObjectType()
export class CreateHotelOutput extends CoreOutput {}
