import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from "@nestjs/common";
import { ProfileModule } from './profile.module';

async function bootstrap() {
  const app = await NestFactory.create(ProfileModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3001);
}

bootstrap();
