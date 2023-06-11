import { Body, Controller, HttpCode, Post, Request } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from "@nestjs/swagger";

import { AuthenticatedRequest } from "@app/auth-shared/session/interfaces/authenticated-request.interface";
import { JwtAuthGuard } from "@app/auth-shared/session/guards/jwt.guard";
import { LoginGuard } from "@app/auth-shared/session/guards/login.guard";
import {
  CredentialsAuthenticatedRequest
} from "@app/auth-shared/session/interfaces/credentials-authenticated-request.interface";

import { SessionService } from "./session.service";
import { AccessTokenResponseDto } from "./dto/access-token-response.dto";
import { TokenPairResponseDto } from "@app/auth-shared/session/dto/token-pair-response.dto";
import { RefreshTokenGuard } from "@app/auth-shared/session/guards/refresh-token.guard";
import { RefreshTokenDto } from "@app/auth-shared/session/dto/refresh-token.dto";
import {ApiCreatedResponse} from "@nestjs/swagger/dist/decorators/api-response.decorator";

@ApiTags('Сессии')
@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post('/login')
  @LoginGuard()
  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiCreatedResponse({
    description: 'Успешная авторизация пользователя',
    type: TokenPairResponseDto
  })
  async login(@Request() req: CredentialsAuthenticatedRequest): Promise<TokenPairResponseDto> {
    return this.sessionService.login(req.user);
  }

  @Post('/access-token/update')
  @RefreshTokenGuard()
  @ApiOperation({ summary: 'Генерация токена доступа' })
  @ApiCreatedResponse({
    description: 'Успешная генерация токена доступа',
    type: AccessTokenResponseDto
  })
  @ApiUnauthorizedResponse( { description: 'Невалидный refresh token'})
  async refreshAccessToken(@Body() data: RefreshTokenDto)
    : Promise<AccessTokenResponseDto>
  {
    return {
      accessToken: await this.sessionService.generateAccessToken(data.refreshToken)
    };
  }

  @Post('/logout')
  @HttpCode(204)
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
  @HttpCode(204)
  @JwtAuthGuard()
  @ApiOperation({ summary: 'Выход из всех устройств' })
  @ApiNoContentResponse({ description: 'Успешный выход из всех устройств' })
  @ApiBearerAuth()
  async logoutAll(@Request() req: AuthenticatedRequest): Promise<void> {
    await this.sessionService.logoutAll(req.accessTokenData.user.id);
  }
}
 
