/* eslint-disable */
import { LocalDate } from '@js-joda/core';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/entities/core.entity';
import { LocalDateTransformer } from 'src/common/utils/local-date-time.transformer';
import { Hotel } from 'src/entities/hotel.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@InputType('HotelWindowInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class HotelWindow extends CoreEntity {

  @Field(type => Hotel)
  @JoinColumn()
  @ManyToOne(() => Hotel, { nullable: false })
  hotel: Hotel;

  @Field(type => Date)
  @Column({
    type: 'date',
    transformer: new LocalDateTransformer()
  })
  date: LocalDate;

  @Field(type => Boolean)
  @Column({ default: false })
  isOpen: boolean;

  @Field(type => Boolean)
  @Column({ default: false })
  hasCookie: boolean;
}
