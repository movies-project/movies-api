import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { apiConfig } from "@app/config/api.config";
import { swaggerConfig } from "@app/config/swagger.config";
import { ApiModule } from './api.module';

function setupSwagger(app) {
  const config = new DocumentBuilder().build();
  const document = SwaggerModule.createDocument(app, config);
  const urls = Object.values(swaggerConfig.docs).map((obj) =>
    <Object>{
      name: obj.name,
      url: `/api/service-docs/${obj.endpoint}`
    }
  );

  SwaggerModule.setup('/docs', app, document, {
    explorer: true,
    swaggerOptions: {
      urls
    }
  });
}

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  setupSwagger(app);

  const port = apiConfig.PORT;
  await app.listen(port, () => {
    console.log('Server is listening on port', port);
  });
}

bootstrap();