/* eslint-disable */
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
//import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateHotelInput, CreateHotelOutput } from './dtos/create-hotel.dto';
import { HotelService } from './hotels.service';
import { Hotel } from './entities/hotel.entity';

@Resolver(of => Hotel)
export class HotelResolver {
  constructor(private readonly hotelService:HotelService) {}

  @Mutation(returns => CreateHotelOutput)
  async CreateHotel(
    authUser: User,
    @Args('input') CreateHotelInput: CreateHotelInput,
  ): Promise<CreateHotelOutput> {
    return this.hotelService.createHotel(
      authUser,
      CreateHotelInput,
    );
  }
}
