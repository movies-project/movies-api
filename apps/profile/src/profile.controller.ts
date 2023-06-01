import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "@app/auth-shared/session/guards/jwt.guard";
import { AuthenticatedRequest } from "@app/auth-shared/session/interfaces/authenticated-request.interface";
import { Profile } from "@app/profile-shared/models/profile.model";
import { ProfileService } from './profile.service';
import { ProfileRegistrationDto } from "./dto/profile-registration.dto";

@ApiTags('Профиль')
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @ApiOperation({ summary: 'Создать профиль' })
  @ApiCreatedResponse({ description: 'Профиль успешно создан' })
  async createProfileAndUser(@Body() data: ProfileRegistrationDto) {
    return await this.profileService.createProfileAndUser(data);
  }

  @Get('/self')
  @JwtAuthGuard()
  @ApiOperation({ summary: 'Получение собственного профиля' })
  @ApiOkResponse({ description: 'Успешное получение профиля' })
  @ApiBearerAuth()
  async findOne(@Request() req: AuthenticatedRequest): Promise<Profile> {
    return this.profileService.findByUserId(req.accessTokenData.user.id);
  }
}
