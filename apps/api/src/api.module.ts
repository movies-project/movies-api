import { Module } from '@nestjs/common';
import { ClientsModule } from "@nestjs/microservices";
import { rabbitmqConfig } from "@app/config";
import { ApiController } from "./api.controller";

@Module({
  imports: [
    ClientsModule.register(rabbitmqConfig.RMQ_AUTH_OPTIONS)
  ],
  controllers: [ApiController],
  providers: []
})
export class ApiModule {}