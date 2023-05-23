import { Body, Controller, Get, HttpCode, Post, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { ProfileService } from './profile.service';
import { ProfileRegistrationDto } from "./dto/profile-registration.dto";
import { JwtAuthGuard } from "@app/guards/jwt.guard";

@ApiTags('Профиль')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @ApiOperation({ summary: 'Создать профиль' })
  @ApiCreatedResponse({ description: 'Профиль успешно создан' })
  async createProfileAndUser(@Body() data: ProfileRegistrationDto) {
    return {
      status: 'success',
      profileId: await this.profileService.createProfileAndUser(data)
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard())
  @ApiOperation({ summary: 'Получение собственного профиля' })
  @ApiOkResponse({ description: 'Успешное получение профиля' })
  @ApiBearerAuth()
  async findOne(@Request() req) {
    const userInfo = req['user'];
    return this.profileService.findByUserId(userInfo.id);
  }

  @MessagePattern('profile_find_by_user_id')
  async findByUserId(@Payload() userId: number) {
    return this.profileService.findByUserId(userId);
  }
}
