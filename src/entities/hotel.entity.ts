import { CoreEntity } from 'src/entities/core.entity';
import { Member } from './member.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Background, BuildingDecorator, GardenDecorator, WindowDecorator } from './domain/hotel-decorator.type';

@Entity()
export class Hotel extends CoreEntity {

  @JoinColumn()
  @OneToOne(type => Member, { nullable: false })
  member: Member;

  @Column()
  nickname: string;

  @Column()
  description: string;

  @Column()
  structColor: string;

  @Column()
  bodyColor: string;

  @Column({
    type: 'enum',
    enum: BuildingDecorator,
    default: BuildingDecorator.buildingDeco01,
    nullable: false
  })
  buildingDecorator: BuildingDecorator;

  @Column({
    type: 'enum',
    enum: GardenDecorator,
    default: GardenDecorator.gardenDeco01,
    nullable: false
  })
  gardenDecorator: GardenDecorator;

  @Column({
    type: 'enum',
    enum: WindowDecorator,
    default: WindowDecorator.windowDeco01,
    nullable: false
  })
  windowDecorator: WindowDecorator;

  @Column({
    type: 'enum',
    enum: Background,
    default: Background.background01,
    nullable: false
  })
  background: Background;

}
