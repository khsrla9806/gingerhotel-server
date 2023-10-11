import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { User } from './entities/user.entity';
import { Hotel } from './entities/hotel.entity';
import { Letter } from './entities/letter.entity';
import * as Joi from 'joi';
import { Membership } from './entities/membership.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { HotelWindow } from './entities/hotel-window.entity';
import { Reply } from './entities/reply.entity';
import { NotificationHistory } from './entities/notification-history.entity';
import { PaymentHistory } from './entities/payment-history.entity';
import { UserBlockHistory } from './entities/user-block-history.entity';
import { Village } from './entities/village.entity';
import { Feek } from './entities/feek.entity';

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === "dev" ? ".env.dev" : ".env.test",
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
      synchronize: true,
      logging: true,
      entities: [
        User, 
        Hotel, 
        HotelWindow, 
        Letter, 
        Membership, 
        Reply, 
        NotificationHistory,
        PaymentHistory,
        UserBlockHistory,
        Village,
        Feek
      ],
      namingStrategy: new SnakeNamingStrategy()
    }),
    UserModule,
    CommonModule
],
  controllers: [],
  providers: [],
})

export class AppModule {}

/** 
 * 
   TypeOrmModule.forRoot({
      type: "postgres",
      host: "127.0.0.1",
      port: 5433,
      username: "postgres",
      password: "123456",
      database: "postgres",
      synchronize: true,
      logging: true,
      entities: [User, Hotel, Window, Letter],
  }),
 * **/