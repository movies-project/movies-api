import { applyDecorators, CanActivate, ExecutionContext, Injectable, UseGuards } from "@nestjs/common";
import { ApiForbiddenResponse, ApiUnauthorizedResponse } from "@nestjs/swagger";

import { VerifyAccessTokenIdto } from "@app/auth-shared/session/internal-dto/verify-access-token.idto";
import { SessionSharedService } from "@app/auth-shared/session/session-shared.service";

import { AuthenticatedRequest } from "../interfaces/authenticated-request.interface";
import { InvalidAccessTokenException } from "@app/auth-shared/session/common/invalid-access-token-exception";
import { VerificationTokenError } from "@app/auth-shared/session/common/verification-token-result";
import { RolePermissionException } from "@app/auth-shared/session/common/role-permission-exception";
import { SharedModule } from "@app/shared";

export const ADMIN_ROLE = 'admin';

@Injectable()
export class JwtAuthGuardMixin implements CanActivate {
  constructor(
    public readonly sessionSharedService: SessionSharedService,
    public readonly role?: string
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    // Получаем header авторизации (тип токена и сам токен)
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new InvalidAccessTokenException();
    }

    const accessToken = authHeader.slice(7, authHeader.length);
    // Проверка валидности access токена

    let authInfo = await this.sessionSharedService.verifyAccessToken(
      <VerifyAccessTokenIdto>{ accessToken, role: this.role }
    );

    if (!authInfo)
      throw new InvalidAccessTokenException();

    if (!authInfo.authorized) {
      if (authInfo.error === VerificationTokenError.ForbiddenRole)
        throw new RolePermissionException();
      throw new InvalidAccessTokenException();
    }

    request.accessTokenData = authInfo.token;

    return true;
  }
}

export function JwtAuthGuard(role?: string) {
  @Injectable()
  class InternalJwtAuthGuardMixin extends JwtAuthGuardMixin {
    constructor(sessionSharedService: SessionSharedService) {
      super(sessionSharedService, role);
    }
  }

  const apiUnauthorizedResponse = ApiUnauthorizedResponse( {
    description: 'Невалидный токен доступа',
    type: SharedModule.generateDocsByHttpException(new InvalidAccessTokenException())
  });
  const apiForbiddenResponse = ApiForbiddenResponse({
    description: 'Отказано в доступе',
    type: SharedModule.generateDocsByHttpException(new RolePermissionException())
  });

  // Добавляем ошибку 401 Unauthorized и 403 Forbidden для документации Swagger
  return applyDecorators(
    UseGuards(InternalJwtAuthGuardMixin),
    apiUnauthorizedResponse,
    // Если роль существует, то добавляем 403 ошибку
    role ? apiForbiddenResponse : () => {}
  );
}
