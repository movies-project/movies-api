import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
 
import { JwtAuthGuard } from "@app/guards/jwt.guard";
import { SessionService } from "./session.service";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";

@ApiTags('Сессии')
@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiOkResponse({ description: 'Успешная авторизация пользователя' })
  @Post('login')
  async login(@Body() data: LoginDto) {
    return {
      'refreshToken': await this.sessionService.login(data.email, data.password)
    };
  }

  @ApiOperation({ summary: 'Генерация токена доступа' })
  @ApiOkResponse({ description: 'Успешная генерация токена доступа' })
  @Post('accessToken')
  async generateAccessToken(@Body() data: RefreshTokenDto) {
    return {
      'accessToken': await this.sessionService.generateAccessToken(data.refreshToken)
    };
  }

  @MessagePattern('session_verify_access_token')
  async verifyAccessToken(@Payload() data: { accessToken: string, role: string }) {
    try {
      return {
        'authorized': true,
        ...await this.sessionService.verifyAccessToken(data.accessToken, data.role)
      };
    } catch {
      return { 'authorized': false };
    }
  }

  @ApiOperation({ summary: 'Выход из аккаунта' })
  @ApiOkResponse({ description: 'Успешный выход из системы' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard())
  @Post('logout')
  async logout(@Req() req: Request) {
    return this.sessionService.logout(req['userId'], req['userSession']);
  }

  @ApiOperation({ summary: 'Выход из всех устройств' })
  @ApiOkResponse({ description: 'Успешный выход из всех устройств' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard())
  @Post('logoutAll')
  async logoutAll(@Req() req: Request) {
    await this.sessionService.logoutAll(req['userId']);
    return { status: 'success' }
  }
}
 
