import { Module } from "@nestjs/common";
import { ClientsModule } from "@nestjs/microservices";
import { rabbitmqConfig } from "@app/config";
import { UserSharedService } from "@app/auth-shared/user/user-shared.service";

@Module({
  imports: [
    ClientsModule.register([rabbitmqConfig.RMQ_AUTH_MODULE_OPTIONS]),
  ],
  controllers: [],
  providers: [UserSharedService],
  exports: [UserSharedService, ClientsModule]
})
export class UserSharedModule {}