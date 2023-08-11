/* eslint-disable */
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import { Window } from 'src/windows/entities/window.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
//import { Category } from './cetegory.entity';

@InputType('HotelInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Hotel extends CoreEntity {
  @Field(type => String)
  @Column()
  @IsString() 
  @Length(12)
  nickname: string;

  @Field(type => String)
  @Column()
  @IsString()
  description: string;

  @Field(type => String, { defaultValue: '#FFFFFF' })
  @Column()
  @IsString()
  headColor: string;

  @Field(type => String, { defaultValue: '#FFFFFF' })
  @Column()
  @IsString()
  bodyColor: string;

  @OneToMany((type) => Window, (window) => window.hotel)
  windows: Window[];

  @OneToOne(type => User)
  @JoinColumn()
  user: User;
  
  /*@Field(type => Category, { nullable: true })
  @ManyToOne(
    type => Category,
    category => category.restaurants,
    { nullable: true, onDelete: 'SET NULL' },
  )
  category: Category;

  @Field(type => User)
  @ManyToOne(
    type => User,
    user => user.restaurants,
  )
  owner: User;*/
}
