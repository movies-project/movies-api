import { MessagePattern, Payload } from "@nestjs/microservices";
import { Controller } from "@nestjs/common";

import { sessionPatterns } from "@app/microservices/auth/session.patterns";
import { AuthResponseIdto } from "@app/auth-shared/session/internal-dto/auth-response.idto";
import { VerifyAccessTokenIdto } from "@app/auth-shared/session/internal-dto/verify-access-token.idto";
import { VerifyAccessTokenResponseIdto } from "@app/auth-shared/session/internal-dto/verify-access-token-response.idto";
import { User } from "@app/auth-shared/user/models/user.model";
import { SessionService } from "./session.service";

@Controller('session-message')
export class SessionMessageController {
  constructor(private readonly sessionService: SessionService) {}

  @MessagePattern(sessionPatterns.LOGIN)
  async login(@Payload() user: User): Promise<AuthResponseIdto> {
    return this.sessionService.login(user);
  }

  @MessagePattern(sessionPatterns.VERIFY_ACCESS_TOKEN)
  async verifyAccessToken(@Payload() data: VerifyAccessTokenIdto)
    : Promise<VerifyAccessTokenResponseIdto>
  {
    try {
      const decodedAccessToken = await this.sessionService.verifyAccessToken(
        data.accessToken,
        data.role
      );
      return {
        authorized: true,
        token: decodedAccessToken,
      }
    } catch {
      return {
        authorized: false,
        token: undefined
      }
    }
  }

}