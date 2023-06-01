import { Module } from "@nestjs/common";
import { ClientsModule } from "@nestjs/microservices";
import { rabbitmqConfig } from "@app/config";
import { ProfileSharedService } from "./profile-shared.service";

@Module({
  imports: [
    ClientsModule.register([rabbitmqConfig.RMQ_PROFILE_MODULE_OPTIONS]),
  ],
  controllers: [],
  providers: [ProfileSharedService],
  exports: [ProfileSharedService, ClientsModule]
})
export class ProfileSharedModule {}