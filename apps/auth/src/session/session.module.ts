import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SessionController } from "./session.controller";
import { ClientsModule } from "@nestjs/microservices";
import { rabbitmqConfig } from "@app/config";
import { SessionService } from "./session.service";
import { UserService } from "../user/user.service";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    JwtModule.register({}),
    ClientsModule.register([rabbitmqConfig.RMQ_AUTH_MODULE_OPTIONS]),
    UserModule
  ],
  controllers: [SessionController],
  providers: [SessionService, UserService],
  exports: [SessionService]
})
export class SessionModule {}