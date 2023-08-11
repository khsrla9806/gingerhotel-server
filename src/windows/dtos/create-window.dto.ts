/* eslint-disable */
import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Window } from '../entities/window.entity';

@InputType()
export class CreateWindowInput extends PickType(Window, [
  'date',
  'isOpen',
  'hasCookie',
  'hotel',
]) {
  /* @Field(type => String)
  categoryName: string; */
}

@ObjectType()
export class CreateWindowOutput extends CoreOutput {}
