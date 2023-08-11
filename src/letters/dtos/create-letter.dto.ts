/* eslint-disable */

import { InputType, PickType } from "@nestjs/graphql";
import { Letter } from "../entities/letter.entity";

@InputType()
export class CreateLetterInput extends PickType(Letter, [
  'sender',
  'content',
]) {}