/* eslint-disable */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';


import { CreateWindowInput, CreateWindowOutput } from './dtos/create-window.dto';
import { Window } from './entities/window.entity';

@Injectable()
export class WindowService {
  constructor(
    @InjectRepository(Window)
    private readonly windows: Repository<Window>,

  ) {}

  async createHotel(
    owner: User,
    createWindowInput: CreateWindowInput,
  ): Promise<CreateWindowOutput> {
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
