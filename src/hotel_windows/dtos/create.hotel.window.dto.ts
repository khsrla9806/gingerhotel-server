/* eslint-disable */
import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { HotelWindow } from '../../entities/hotel-window.entity';

@InputType()
export class CreateHotelWindowInput extends PickType(HotelWindow, [
  'date',
  'isOpen',
  'hasCookie',
  'hotel',
]) {
  /* @Field(type => String)
  categoryName: string; */
}

@ObjectType()
export class CreateHotelWindowOutput extends CoreOutput {}
