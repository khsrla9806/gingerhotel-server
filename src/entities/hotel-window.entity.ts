/* eslint-disable */
import { LocalDate } from '@js-joda/core';
import { CoreEntity } from 'src/entities/core.entity';
import { LocalDateTransformer } from 'src/common/utils/local-date-time.transformer';
import { Hotel } from 'src/entities/hotel.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class HotelWindow extends CoreEntity {

  @JoinColumn()
  @ManyToOne(() => Hotel, { nullable: false })
  private hotel: Hotel;

  @Column({
    type: 'date',
    transformer: new LocalDateTransformer()
  })
  private date: LocalDate;

  @Column({ default: false })
  private isOpen: boolean;

  @Column({ default: false })
  private hasCookie: boolean;
}
