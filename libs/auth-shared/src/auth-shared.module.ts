import { Module } from "@nestjs/common";
import { UserSharedModule } from "@app/auth-shared/user/user-shared.module";
import { SessionSharedModule } from "@app/auth-shared/session/session-shared.module";

@Module({
  imports: [
    UserSharedModule,
    SessionSharedModule
  ],
  controllers: [],
  providers: [],
  exports: [UserSharedModule, SessionSharedModule]
})
export class AuthSharedModule {}