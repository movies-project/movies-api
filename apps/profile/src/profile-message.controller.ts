import { MessagePattern, Payload } from "@nestjs/microservices";
import { Controller } from "@nestjs/common";

import { profilePatterns } from "@app/microservices/profile/profile.patterns";
import { Profile } from "@app/profile-shared/models/profile.model";
import { ProfileService } from "./profile.service";

@Controller('profile-message')
export class ProfileMessageController {
  constructor(private readonly profileService: ProfileService) {}

  @MessagePattern(profilePatterns.FIND_BY_USER_ID)
  async findByUserId(@Payload() userId: number): Promise<Profile> {
    return this.profileService.findByUserId(userId);
  }

}