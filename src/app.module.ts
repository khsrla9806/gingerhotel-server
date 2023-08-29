/* eslint-disable */
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { User } from './users/entities/user.entity';
import { Hotel } from './hotels/entities/hotel.entity';
import { HotelModule } from './hotels/hotels.module';
import { Window } from './windows/entities/window.entity';
import { WindowModule } from './windows/windows.module';
import { Letter } from './letters/entities/letter.entity';
import { LetterModule } from './letters/letters.module';
import * as Joi from 'joi';

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
      entities: [User, Hotel, Window, Letter],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
    driver: ApolloDriver,
    autoSchemaFile: true,
  }), 
  LetterModule,
  UserModule,
  CommonModule,
  HotelModule,
  WindowModule,
],
  controllers: [],
  providers: [],
})

export class AppModule {}