/* eslint-disable */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
              secret: configService.get('JWT_SECRET_KEY'),
              signOptions: { expiresIn: configService.get('ACCESS_TOKEN_EXP') },
            }),
          }),
    ],
    providers: [JwtStrategy],
})
export class UserModule {}