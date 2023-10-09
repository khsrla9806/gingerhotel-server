import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { MembershipLever } from "./domain/membership.lever";

@Entity()
export class Membership {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', nullable: true, enum: MembershipLever })
  level: MembershipLever;

  @Column({ default: false })
  hasLetterLimit: boolean;

  @Column({ default: false })
  isPossibleAttachImage: boolean;

  @Column({ default: false })
  isPossibleReply: boolean;

  @Column({ default: false })
  isPossiblePeek: boolean;

  @Column({ default: false })
  isPossibleSearchExposure: boolean;
}