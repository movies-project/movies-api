import { Module } from '@nestjs/common';
import { ClientsModule } from "@nestjs/microservices";
import { SequelizeModule } from "@nestjs/sequelize";

import { postgresConfig, rabbitmqConfig } from "@app/config";
import { Profile } from "@app/profile-shared/models/profile.model";
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { ProfileMessageController } from "./profile-message.controller";
import { SessionSharedService } from "@app/auth-shared/session/session-shared.service";
import { UserSharedService } from "@app/auth-shared/user/user-shared.service";
import { AuthSharedModule } from "@app/auth-shared/auth-shared.module";

@Module({
  imports: [
    SequelizeModule.forRoot(postgresConfig.PROFILE_DB_OPTIONS),
    SequelizeModule.forFeature([Profile]),
    AuthSharedModule
  ],
  controllers: [ProfileController, ProfileMessageController],
  providers: [ProfileService, SessionSharedService, UserSharedService],
})
export class ProfileModule {}
