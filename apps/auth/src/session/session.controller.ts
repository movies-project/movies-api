import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { JwtAuthGuard } from "@app/guards/jwt.guard";
import { SessionService } from "./session.service";
import { LoginData } from "./dto/login.dto";

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post('login')
  async login(@Body() data: LoginData) {
    return {
      'refreshToken': await this.sessionService.login(data.email, data.password)
    };
  }

  @Post('accessToken')
  async generateAccessToken(@Body() data: { refreshToken: string }) {
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

  @Post('logout')
  @UseGuards(JwtAuthGuard())
  async logout(@Req() req: Request) {
    return this.sessionService.logout(req['userId'], req['userSession']);
  }

  @Post('logoutAll')
  @UseGuards(JwtAuthGuard())
  async logoutAll(@Req() req: Request) {
    return this.sessionService.logoutAll(req['userId']);
  }
}