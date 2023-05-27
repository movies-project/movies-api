import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { rabbitmqConfig } from "@app/config";

export function JwtAuthGuard(role?: string) {

  @Injectable()
  class JwtAuthGuardMixin implements CanActivate {

    constructor(
      @Inject(rabbitmqConfig.RMQ_AUTH_MODULE_OPTIONS.name)
      public readonly authApp: ClientProxy,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      // Получаем header авторизации (тип токена и сам токен)
      const authHeader = request.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return false;
      }

      const accessToken = authHeader.slice(7, authHeader.length);
      // Проверка валидности access токена
      let authInfo = await firstValueFrom(
        this.authApp.send('session_verify_access_token', {accessToken, role})
      );

      if (!authInfo['authorized'])
        return false;

      request.user = authInfo['user'];
      request.session = authInfo['session'];
      return true;
    }
  }
  return JwtAuthGuardMixin;
}
