import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth, ApiBody,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from "@nestjs/swagger";

import { AuthenticatedRequest } from "@app/auth-shared/session/interfaces/authenticated-request.interface";
import { JwtAuthGuard } from "@app/auth-shared/session/guards/jwt.guard";
import { LoginGuard } from "@app/auth-shared/session/guards/login.guard";
import { AuthCredentialsDto } from "@app/auth-shared/session/dto/auth-credentials.dto";
import {
  CredentialsAuthenticatedRequest
} from "@app/auth-shared/session/interfaces/credentials-authenticated-request.interface";

import { SessionService } from "./session.service";
import { AccessTokenResponseDto } from "./dto/access-token-response.dto";
import { AuthResponseDto } from "./dto/auth-response.dto";

@ApiTags('Сессии')
@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post('/login')
  @LoginGuard()
  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiOkResponse({ description: 'Успешная авторизация пользователя' })
  @ApiUnauthorizedResponse( { description: 'Неверные данные для входа' })
  @ApiBody({ type: AuthCredentialsDto, description: 'Данные для входа' })
  async login(@Request() req: CredentialsAuthenticatedRequest): Promise<AuthResponseDto> {
    return this.sessionService.login(req.user);
  }

  @Post('/access-token/update')
  @ApiOperation({ summary: 'Генерация токена доступа' })
  @ApiOkResponse({ description: 'Успешная генерация токена доступа' })
  @ApiUnauthorizedResponse( { description: 'Невалидный refresh token'})
  async refreshAccessToken(@Body('refreshToken') refreshToken: string)
    : Promise<AccessTokenResponseDto>
  {
    return {
      accessToken: await this.sessionService.generateAccessToken(refreshToken)
    };
  }

  @Post('/logout')
  @JwtAuthGuard()
  @ApiOperation({ summary: 'Выход из аккаунта' })
  @ApiNoContentResponse({ description: 'Успешный выход из системы' })
  @ApiBearerAuth()
  async logout(@Request() req: AuthenticatedRequest): Promise<void> {
    return this.sessionService.logout(
      req.accessTokenData.user.id,
      req.accessTokenData.session
    );
  }

  @Post('/logoutAll')
  @JwtAuthGuard()
  @ApiOperation({ summary: 'Выход из всех устройств' })
  @ApiNoContentResponse({ description: 'Успешный выход из всех устройств' })
  @ApiBearerAuth()
  async logoutAll(@Request() req: AuthenticatedRequest): Promise<void> {
    await this.sessionService.logoutAll(req.accessTokenData.user.id);
  }
}
 
