import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from "@nestjs/common";
import { swaggerConfig } from "@app/config/swagger.config";
import { SharedModule } from "@app/shared";
import { ProfileModule } from './profile.module';

async function bootstrap() {
  const app = await NestFactory.create(ProfileModule);

  SharedModule.setupSwaggerFromConfig(app, swaggerConfig.docs.PROFILE_API);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3002);
}

bootstrap();
