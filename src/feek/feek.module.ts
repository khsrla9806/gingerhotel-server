import { Module } from '@nestjs/common';
import { FeekService } from './service/feek.service';
import { FeekController } from './controller/feek.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feek } from 'src/entities/feek.entity';
import { Letter } from 'src/entities/letter.entity';
import { MemberBlockHistory } from 'src/entities/member-block-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Feek, Letter, MemberBlockHistory])
  ],
  providers: [FeekService],
  controllers: [FeekController]
})
export class FeekModule {}
