import { ApiBody, ApiUnauthorizedResponse } from "@nestjs/swagger";
import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  Injectable,
  UseGuards
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { AuthCredentialsDto } from "@app/auth-shared/session/dto/auth-credentials.dto";
import { UserSharedService } from "@app/auth-shared/user/user-shared.service";
import {
  CredentialsAuthenticatedRequest
} from "@app/auth-shared/session/interfaces/credentials-authenticated-request.interface";
import { InvalidCredentialsException } from "@app/auth-shared/session/common/invalid-credentials-exception";
import { SharedModule } from "@app/shared";

export function LoginGuard() {
  @Injectable()
  class LoginGuardMixin implements CanActivate {
    constructor(
      public readonly userSharedService: UserSharedService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest<CredentialsAuthenticatedRequest>();

      // Получаем email и пароль из запроса
      const authCredentials: AuthCredentialsDto = request.body;

      const user = await this.userSharedService.findByEmail(authCredentials.email);

      if (!user)
        throw new InvalidCredentialsException();

      const passwordEquals = await bcrypt.compare(
        authCredentials.password,
        user.passwordHash
      );

      if (!passwordEquals)
        throw new InvalidCredentialsException();

      request.user = user;

      return true;
    }
  }

  return applyDecorators(
    UseGuards(LoginGuardMixin),
    ApiBody({
      description: 'Данные авторизации',
      type: AuthCredentialsDto
    }),
    ApiUnauthorizedResponse( {
      description: 'Неверные учетные данные',
      type: SharedModule.generateDocsByHttpException(new InvalidCredentialsException())
    })
  );
}