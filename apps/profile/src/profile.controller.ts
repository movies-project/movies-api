import { Body, Controller, Get, Post, Request, UseInterceptors, UsePipes } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from "@nestjs/swagger";
import { JwtAuthGuard } from "@app/auth-shared/session/guards/jwt.guard";
import { AuthenticatedRequest } from "@app/auth-shared/session/interfaces/authenticated-request.interface";
import { Profile } from "@app/profile-shared/models/profile.model";
import { ProfileService } from './profile.service';
import { ProfileRegistrationDto } from "./dto/profile-registration.dto";
import { ProfileRegistrationResponseDto } from "./dto/profile-registration-response.dto";
import { ProfileExistsException } from "./common/profile-exists.exception";
import { ExistingUserPipe } from "@app/auth-shared/user/pipes/existing-user.pipe";
import { SharedModule } from "@app/shared";
import { RemoveTimestampsInterceptor } from "@app/interceptors/remove-timestamps.interceptor";
import { SingleLevelTimestampsInterceptor } from "@app/interceptors/single-level-timestamps.interceptor";

@ApiTags('Профиль')
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @UsePipes(ExistingUserPipe(false, new ProfileExistsException()))
  @UseInterceptors(SingleLevelTimestampsInterceptor)
  @ApiOperation({ summary: 'Создать профиль' })
  @ApiCreatedResponse({
    description: 'Профиль успешно создан',
    type: ProfileRegistrationResponseDto
  })
  @ApiConflictResponse({
    description: 'Профиль уже существует',
    type: SharedModule.generateDocsByHttpException(new ProfileExistsException())
  })
  async createProfileAndUser(@Body() data: ProfileRegistrationDto)
    : Promise<ProfileRegistrationResponseDto> {
    return await this.profileService.createProfileAndUser(data);
  }

  @Get('/self')
  @JwtAuthGuard()
  @UseInterceptors(RemoveTimestampsInterceptor)
  @ApiOperation({ summary: 'Получение собственного профиля' })
  @ApiOkResponse({
    description: 'Успешное получение профиля',
    type: Profile
  })
  @ApiBearerAuth()
  async findOne(@Request() req: AuthenticatedRequest): Promise<Profile> {
    return this.profileService.findByUserId(req.accessTokenData.user.id);
  }
}
