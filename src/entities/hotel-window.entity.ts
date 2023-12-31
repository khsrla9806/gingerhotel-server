/* eslint-disable */
import { LocalDate } from '@js-joda/core';
import { CoreEntity } from 'src/entities/core.entity';
import { LocalDateTransformer } from 'src/common/utils/local-date-time.transformer';
import { Hotel } from 'src/entities/hotel.entity';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

@Unique(['hotel', 'date'])
@Entity()
export class HotelWindow extends CoreEntity {

  @JoinColumn()
  @ManyToOne(() => Hotel, { nullable: false })
  hotel: Hotel;

  @Column({
    type: 'date',
    transformer: new LocalDateTransformer(),
    nullable: false
  })
  date: LocalDate;

  @Column({ default: false })
  isOpen: boolean;

  @Column({ default: false })
  hasCookie: boolean;

  @Column({ default: true })
  hasLimit: boolean;
}
