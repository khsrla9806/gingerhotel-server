import { Module } from '@nestjs/common';
import { FeekService } from './feek.service';
import { FeekController } from './feek.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feek } from 'src/entities/feek.entity';
import { Letter } from 'src/entities/letter.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Feek, Letter])
  ],
  providers: [FeekService],
  controllers: [FeekController]
})
export class FeekModule {}
