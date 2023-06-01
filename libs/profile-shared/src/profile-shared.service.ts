import { ClientProxy } from "@nestjs/microservices";
import { Inject, Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { rabbitmqConfig } from "@app/config";
import { profilePatterns } from "@app/microservices/profile/profile.patterns";
import { Profile } from "@app/profile-shared/models/profile.model";

@Injectable()
export class ProfileSharedService {
  constructor(
    @Inject(rabbitmqConfig.RMQ_PROFILE_MODULE_OPTIONS.name)
    private readonly profileService: ClientProxy,
  ) {}

  async findByUserId(userId: number): Promise<Profile> {
    return await firstValueFrom(
      this.profileService.send(profilePatterns.FIND_BY_USER_ID, userId)
    );
  }
}