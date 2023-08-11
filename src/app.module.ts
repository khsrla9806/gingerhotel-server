/* eslint-disable */
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { User } from './users/entities/user.entity';
import { Hotel } from './hotels/entities/hotel.entity';
import { HotelModule } from './hotels/hotels.module';
import { Window } from './windows/entities/window.entity';
import { WindowModule } from './windows/windows.module';
import { Letter } from './letters/entities/letter.entity';
import { LetterModule } from './letters/letters.module';

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === "dev" ? ".env.dev" : ".env.test"
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "1234",
      database: "nuber-eats",
      synchronize: true,
      logging: true,
      entities: [User, Hotel, Window, Letter],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
    driver: ApolloDriver,
    autoSchemaFile: true,
  }), 
  LetterModule,
  UsersModule,
  CommonModule,
  HotelModule,
  WindowModule,
],
  controllers: [],
  providers: [],
})

export class AppModule {}