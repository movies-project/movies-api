import { NestFactory } from '@nestjs/core';
import { MediaModule } from './media.module';

async function bootstrap() {
  const app = await NestFactory.create(MediaModule);
}
bootstrap();
