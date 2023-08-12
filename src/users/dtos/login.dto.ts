/* eslint-disable */

import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { User } from "../entities/user.entity";
import { CoreOutput } from "src/common/dtos/output.dto";

@InputType()
export class LoginInput extends PickType(User, ['email', 'password']){}

@ObjectType()
export class LoginOutput extends CoreOutput {
    @Field(type => String)
    token: string;
}