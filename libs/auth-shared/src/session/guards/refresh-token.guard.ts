import { ApiBody, ApiUnauthorizedResponse } from "@nestjs/swagger";
import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  Injectable,
  UseGuards
} from "@nestjs/common";
import { SharedModule } from "@app/shared";
import { RefreshTokenDto } from "@app/auth-shared/session/dto/refresh-token.dto";
import { InvalidAccessTokenException } from "@app/auth-shared/session/common/invalid-access-token-exception";
import { InvalidRefreshTokenException } from "@app/auth-shared/session/common/invalid-refresh-token-exception";
import { SessionSharedService } from "@app/auth-shared/session/session-shared.service";

export function RefreshTokenGuard() {
  @Injectable()
  class RefreshTokenGuardMixin implements CanActivate {
    constructor(
      public readonly sessionSharedService: SessionSharedService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();

      // Получаем email и пароль из запроса
      const data: RefreshTokenDto = request.body;

      let authInfo = await this.sessionSharedService.verifyRefreshToken(
        data.refreshToken
      );

      if (!authInfo?.authorized)
        throw new InvalidRefreshTokenException();

      return true;
    }
  }

  return applyDecorators(
    UseGuards(RefreshTokenGuardMixin),
    ApiBody({
      description: 'Токен обновления',
      type: RefreshTokenDto
    }),
    ApiUnauthorizedResponse( {
      description: 'Невалидный токен обновления',
      type: SharedModule.generateDocsByHttpException(new InvalidAccessTokenException())
    })
  );
}