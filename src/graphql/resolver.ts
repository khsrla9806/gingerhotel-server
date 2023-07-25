import { Injectable } from '@nestjs/common';
import { UserSchema } from 'src/models/UserSchema';
import { UserController } from 'src/modules/user/user.controller';
import { Resolver, Query } from 'type-graphql';

@Injectable()
@Resolver()
export class GingerResolver {
  constructor(private user_controller: UserController) {}

  @Query((returns) => Boolean)
  async findUser() {
    return await this.user_controller.findUser();
  }
}
