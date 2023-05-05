import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from "@nestjs/common";
import { MicroserviceOptions } from "@nestjs/microservices";
import { rabbitmqConfig } from "@app/config";
import { swaggerConfig } from "@app/config/swagger.config";
import { SharedModule } from "@app/shared";
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  SharedModule.setupSwaggerFromConfig(app, swaggerConfig.docs.AUTH_API);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.connectMicroservice<MicroserviceOptions>(rabbitmqConfig.RMQ_AUTH_OPTIONS);

  await app.startAllMicroservices();
  await app.listen(3001);
}

bootstrap();
