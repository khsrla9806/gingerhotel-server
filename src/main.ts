import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './common/swagger/setup-swagger';
import * as expressBasicAuth from 'express-basic-auth';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ErrorCode } from './common/filter/code/error-code.enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ 
    transform: true,
    exceptionFactory: (errors) => {
      const invalidationObject = errors.map((error) => ({
        property: error.property,
        message: error.constraints[Object.keys(error.constraints)[0]],
      }));
      return new BadRequestException(invalidationObject, ErrorCode.ValidationFailed);
    },
  }));
  /* cors setting start */
  app.enableCors({
    origin: [
      'https://www.ginger-hotel.site',
      'https://ginger-hotel.site'
    ],
    credentials: true,
    exposedHeaders: ['Authorization']
  });
  /* cors setting end */
  
  setupSwagger(app);

  const port: number = +process.env.SERVER_PORT;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
