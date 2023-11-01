import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './common/swagger/setup-swagger';
import * as expressBasicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
  await app.listen(port);
}
bootstrap();
