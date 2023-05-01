import { Body, Controller, Post } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileRegistrationData } from "./dto/register.dto";

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  create(@Body() data: ProfileRegistrationData) {
    return this.profileService.create(data);
  }
}
