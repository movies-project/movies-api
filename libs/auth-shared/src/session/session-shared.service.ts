import { ClientProxy } from "@nestjs/microservices";
import { Inject, Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { rabbitmqConfig } from "@app/config";
import { sessionPatterns } from "@app/microservices/auth/session.patterns";
import { AuthResponseIdto } from "@app/auth-shared/session/internal-dto/auth-response.idto";
import { VerifyAccessTokenIdto } from "@app/auth-shared/session/internal-dto/verify-access-token.idto";
import { VerifyAccessTokenResponseIdto } from "@app/auth-shared/session/internal-dto/verify-access-token-response.idto";
import { User } from "@app/auth-shared/user/models/user.model";

@Injectable()
export class SessionSharedService {
  constructor(
    @Inject(rabbitmqConfig.RMQ_AUTH_MODULE_OPTIONS.name)
    private readonly authService: ClientProxy,
  ) {}

  async login(user: User): Promise<AuthResponseIdto> {
    return await firstValueFrom(
      this.authService.send(sessionPatterns.LOGIN, user)
    );
  }

  async verifyAccessToken(data: VerifyAccessTokenIdto): Promise<VerifyAccessTokenResponseIdto> {
    return await firstValueFrom(
      this.authService.send(sessionPatterns.VERIFY_ACCESS_TOKEN, data)
    );
  }

}