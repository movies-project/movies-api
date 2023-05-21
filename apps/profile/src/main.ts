import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from "@nestjs/common";
import { swaggerConfig } from "@app/config/swagger.config";
import { SharedModule } from "@app/shared";
import { ProfileModule } from './profile.module';
import { MicroserviceOptions } from "@nestjs/microservices";
import { rabbitmqConfig } from "@app/config";

async function bootstrap() {
  const app = await NestFactory.create(ProfileModule);

  SharedModule.setupSwaggerFromConfig(app, swaggerConfig.docs.PROFILE_API);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.connectMicroservice<MicroserviceOptions>(rabbitmqConfig.RMQ_PROFILE_OPTIONS);

  await app.startAllMicroservices();

  await app.listen(3002);
}

bootstrap();
