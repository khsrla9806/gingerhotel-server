/* eslint-disable */

import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { User } from "../entities/user.entity";
import { MutationOutput } from "./output.dto";

@InputType()
export class LoginInput extends PickType(User, ['email', 'password']){}

@ObjectType()
export class LoginOutput extends MutationOutput {
    @Field(type => String)
    token: string;
}