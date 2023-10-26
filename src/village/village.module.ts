import { Module } from '@nestjs/common';
import { VillageService } from './service/village.service';
import { VillageController } from './controller/village.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from 'src/entities/hotel.entity';
import { Village } from 'src/entities/village.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Hotel, Village])
  ],
  providers: [VillageService],
  controllers: [VillageController]
})
export class VillageModule {}
