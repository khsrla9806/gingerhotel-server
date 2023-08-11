/* eslint-disable */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Window } from './entities/window.entity';
import { WindowService } from './windows.service';
import { WindowResolver } from './windows.resolover';


@Module({
  imports: [TypeOrmModule.forFeature([Window, ])],
  providers: [WindowResolver, WindowService],
})
export class WindowModule {}
