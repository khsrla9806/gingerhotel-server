import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from 'src/entities/member.entity';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt-strategy';
import { Hotel } from 'src/entities/hotel.entity';
import { MemberInterceptor } from './interceptor/member.interceptor';
import { MemberController } from './controller/members.controller';
import { MemberService } from './service/members.service';

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
  controllers: [AuthController, MemberController],
  providers: [AuthService, MemberService, JwtStrategy, MemberInterceptor],
  exports: [JwtStrategy, JwtModule, PassportModule, MemberInterceptor]
})
export class AuthModule {}
