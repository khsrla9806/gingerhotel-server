import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './common/swagger/setup-swagger';
import * as expressBasicAuth from 'express-basic-auth';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ 
    transform: true,
    exceptionFactory: (errors) => {
      const result = errors.map((error) => ({
        property: error.property,
        message: error.constraints[Object.keys(error.constraints)[0]],
      }));
      return new BadRequestException(result);
    },
  }));
  /* cors setting start */
  app.enableCors({
    origin: ['https://www.ginger-hotel.site', 'https://www.gingerhotel.site', 'http://localhost:8081'],
    credentials: true,
    exposedHeaders: ['Authorization']
  });
  /* cors setting end */

  /* swagger security start */
  app.use(
    ['/api-docs', ],
    expressBasicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
      },
    }),
  );
  /* swagger security end */

  setupSwagger(app);

  const port: number = +process.env.SERVER_PORT;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
