import { Controller, Get, Request, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { JwtAuthGuard } from "@app/auth-shared/session/guards/jwt.guard";
import { AuthenticatedRequest } from "@app/auth-shared/session/interfaces/authenticated-request.interface";
import { UserService } from './user.service';
import { User } from "@app/auth-shared/user/models/user.model";
import { RemoveTimestampsInterceptor } from "@app/interceptors/remove-timestamps.interceptor";

@ApiTags('Пользователи')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/self')
  @JwtAuthGuard()
  @UseInterceptors(RemoveTimestampsInterceptor)
  @ApiOperation({ summary: 'Получение собственных пользовательских данных' })
  @ApiOkResponse({
    description: 'Успешное получение пользовательских данных',
    type: User
  })
  @ApiBearerAuth()
  async getSelfUserData(@Request() req: AuthenticatedRequest): Promise<User> {
    const user = await this.userService.findOne(req.accessTokenData.user.id);
    const { passwordHash, ...userWithSafeFields } = user.dataValues;
    return userWithSafeFields;
  }
}
