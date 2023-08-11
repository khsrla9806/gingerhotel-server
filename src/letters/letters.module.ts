/* eslint-disable */
import { Module } from '@nestjs/common';

import { TypeOrmModule } from "@nestjs/typeorm";
import { LetterResolver } from "./letters.resolver";
import { LetterService } from "./letters.service";
import { Letter } from './entities/letter.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Letter, ])],
    providers: [LetterResolver, LetterService],
  })
  export class LetterModule {}
  