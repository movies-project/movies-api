import { Module } from '@nestjs/common';
import { ClientsModule } from "@nestjs/microservices";
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from "@nestjs/sequelize";

import { rabbitmqConfig } from "@app/config";
import { User } from "@app/auth-shared/user/models/user.model";
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthSharedModule } from "@app/auth-shared/auth-shared.module";
import { UserMessageController } from "./user-message.controller";

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    AuthSharedModule
  ],
  controllers: [UserController, UserMessageController],
  providers: [UserService],
  exports: [UserService, SequelizeModule]
})
export class UserModule {}
