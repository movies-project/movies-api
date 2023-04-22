import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { apiConfig } from "@app/config/api.config";
import { ApiModule } from './api.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  const port = apiConfig.PORT;
  await app.listen(port, () => {
    console.log('Server is listening on port', port);
  });
}

bootstrap();