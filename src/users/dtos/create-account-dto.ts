/* eslint-disable */
import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { User } from '../../entities/user.entity';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class CreateAccountInput extends PickType(User, [
  'email',
  'socialId',
  'birthYear',
  'gender'
]) {}

@ObjectType()
export class CreateAccountOutput extends CoreOutput {}
