import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from "@nestjs/common";
import { SharedModule } from "@app/shared";
import { swaggerConfig } from "@app/config/swagger.config";
import { MainModule } from './main.module';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);

  SharedModule.setupSwaggerFromConfig(app, swaggerConfig.docs.MOVIE_API);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist: true,    // чтобы DTO принимали только необходимые поля
    }
  ));

  await app.listen(3003);
}
bootstrap();
