import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from 'src/entities/member.entity';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt-strategy';
import { Hotel } from 'src/entities/hotel.entity';
import { MemberInterceptor } from './interceptor/member.interceptor';

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
    TypeOrmModule.forFeature([Member, Hotel])
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, MemberInterceptor],
  exports: [JwtStrategy, JwtModule, PassportModule, MemberInterceptor]
})
export class AuthModule {}
