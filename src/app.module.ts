import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { config } from 'src/config';
import { UserSchema } from './models/UserSchema';
import AppResolverModule from './graphql/resolver.module';
import { TypeGraphQLModule } from 'typegraphql-nestjs';
import { ApolloDriver } from '@nestjs/apollo';

@Module({
  imports: [
    TypeGraphQLModule.forRoot({
      driver: ApolloDriver,
    }),
    AppResolverModule,
    // db setting
    // SequelizeModule.forRoot({
    //   dialect: 'mysql',
    //   host: config.db_host,
    //   port: 3306,
    //   username: config.db_user_name,
    //   password: config.db_password,
    //   database: config.db_name,
    //   models: [UserSchema],
    // }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
