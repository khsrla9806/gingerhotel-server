import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { Hotel } from 'src/entities/hotel.entity';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: configService.get('ACCESS_TOKEN_EXP')
        }
      })
    }),
    TypeOrmModule.forFeature([User, Hotel])
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}