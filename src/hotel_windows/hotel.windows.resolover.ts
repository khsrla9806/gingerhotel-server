/* eslint-disable */
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from 'src/entities/user.entity';
import { HotelWindow } from '../entities/hotel-window.entity';
import { HotelWindowService } from './hotel.windows.service';
import { CreateHotelWindowInput, CreateHotelWindowOutput } from './dtos/create.hotel.window.dto';

@Resolver(of => HotelWindow)
export class HotelWindowResolver {
  constructor(private readonly windowService:HotelWindowService) {}

  @Mutation(returns => CreateHotelWindowOutput)
  async CreateWindow(
    authUser: User,
    @Args('input') CreateHotelInput: CreateHotelWindowInput,
  ): Promise<CreateHotelWindowOutput> {
    return this.windowService.createHotel(
      authUser,
      CreateHotelInput,
    );
  }
}
