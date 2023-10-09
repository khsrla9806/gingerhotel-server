/* eslint-disable */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';


import { CreateHotelWindowInput, CreateHotelWindowOutput } from './dtos/create.hotel.window.dto';
import { HotelWindow } from '../entities/hotel-window.entity';

@Injectable()
export class HotelWindowService {
  constructor(
    @InjectRepository(HotelWindow)
    private readonly windows: Repository<HotelWindow>,

  ) {}

  async createHotel(
    owner: User,
    createWindowInput: CreateHotelWindowInput,
  ): Promise<CreateHotelWindowOutput> {
    try {
      const newHotel = this.windows.create(createWindowInput);
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
      await this.windows.save(newHotel);
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
