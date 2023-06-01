import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { SessionService } from "./session.service";
import { SessionController } from "./session.controller";
import { UserService } from "../user/user.service";
import { UserModule } from "../user/user.module";
import { SessionMessageController } from "./session-message.controller";
import { AuthSharedModule } from "@app/auth-shared/auth-shared.module";

@Module({
  imports: [
    JwtModule.register({}),
    AuthSharedModule,
    UserModule
  ],
  controllers: [SessionController, SessionMessageController],
  providers: [SessionService, UserService],
  exports: [SessionService]
})
export class SessionModule {}