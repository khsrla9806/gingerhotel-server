/* eslint-disable */
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
//import { Category } from './cetegory.entity';

@InputType('WindowInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Window extends CoreEntity {
  @Field(type => Number)
  @Column()
  @IsNumber() 
  @Length(200)
  date: Number;

  @Field(type => Boolean)
  @Column()
  @IsBoolean()
  isOpen: Boolean;

  @Field(type => Boolean)
  @Column()
  @IsBoolean()
  hasCookie: Boolean;
  
  @Field(type => Hotel)
  @ManyToOne(
    type => Hotel,
    hotel => hotel.windows,
  )
  @JoinColumn()
  hotel: Hotel;
  /*@Field(type => Category, { nullable: true })
  @ManyToOne(
    type => Category,
    category => category.restaurants,
    { nullable: true, onDelete: 'SET NULL' },
  )
  category: Category;
*/
}
