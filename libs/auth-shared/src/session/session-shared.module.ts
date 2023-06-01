import { Module } from "@nestjs/common";
import { ClientsModule } from "@nestjs/microservices";
import { rabbitmqConfig } from "@app/config";
import { SessionSharedService } from "@app/auth-shared/session/session-shared.service";

@Module({
  imports: [
    ClientsModule.register([rabbitmqConfig.RMQ_AUTH_MODULE_OPTIONS]),
  ],
  controllers: [],
  providers: [SessionSharedService],
  exports: [SessionSharedService, ClientsModule]
})
export class SessionSharedModule {}