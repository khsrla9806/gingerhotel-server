/* eslint-disable */
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
//import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Window } from './entities/window.entity';
import { WindowService } from './windows.service';
import { CreateWindowInput, CreateWindowOutput } from './dtos/create-window.dto';

@Resolver(of => Window)
export class WindowResolver {
  constructor(private readonly windowService:WindowService) {}

  @Mutation(returns => CreateWindowOutput)
  async CreateWindow(
    authUser: User,
    @Args('input') CreateHotelInput: CreateWindowInput,
  ): Promise<CreateWindowOutput> {
    return this.windowService.createHotel(
      authUser,
      CreateHotelInput,
    );
  }
}
