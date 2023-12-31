import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import * as Joi from 'joi';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AuthModule } from './auth/auth.module';
import { LettersModule } from './letters/letters.module';
import { RepliesModule } from './replies/replies.module';
import { HotelModule } from './hotel/hotel.module';
import { VillageModule } from './village/village.module';
import { FeekModule } from './feek/feek.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === "dev" ? ".env.dev" : ".env.prod",
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        JWT_SECRET_KEY: Joi.string().required(),
        ACCESS_TOKEN_EXP: Joi.string().required()
      })
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: process.env.DB_SYNCHRONIZE === 'true' ? true : false,
      logging: process.env.DB_LOGGING === 'true' ? true : false,
      entities: ['dist/**/*.entity.js'],
      namingStrategy: new SnakeNamingStrategy()
    }),
    CommonModule,
    AuthModule,
    LettersModule,
    RepliesModule,
    HotelModule,
    VillageModule,
    FeekModule,
    NotificationsModule
],
  controllers: [],
  providers: [],
})
export class AppModule {}