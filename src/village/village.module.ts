import { Module } from '@nestjs/common';
import { VillageService } from './service/village.service';
import { VillageController } from './controller/village.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from 'src/entities/hotel.entity';
import { Village } from 'src/entities/village.entity';
import { Member } from 'src/entities/member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Hotel, Village, Member])
  ],
  providers: [VillageService],
  controllers: [VillageController]
})
export class VillageModule {}
