/* eslint-disable */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';


import { Hotel } from './entities/hotel.entity';
import { CreateHotelInput, CreateHotelOutput } from './dtos/create-hotel.dto';

@Injectable()
export class HotelService {
  constructor(
    @InjectRepository(Hotel)
    private readonly hotels: Repository<Hotel>,

  ) {}

  async createHotel(
    owner: User,
    createHotelInput: CreateHotelInput,
  ): Promise<CreateHotelOutput> {
    try {
      const newHotel = this.hotels.create(createHotelInput);
      //newHotel.owner = owner;
      /*const categoryName = createHotelInput.categoryName
        .trim()
        .toLowerCase();
      const categorySlug = categoryName.replace(/ /g, '-');
       let category = await this.categories.findOne({ slug: categorySlug });
      if (!category) {
        category = await this.categories.save(
          this.categories.create({ slug: categorySlug, name: categoryName }),
        );
      }
      newHotel.category = category; */
      await this.hotels.save(newHotel);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not create restaurant',
      };
    }
  }
}
