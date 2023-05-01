import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { rabbitmqConfig } from "@app/config";

export function JwtAuthGuard(role?: string) {
  @Injectable()
  class JwtAuthGuardMixin implements CanActivate {
    constructor(
      @Inject(rabbitmqConfig.RMQ_AUTH_MODULE_OPTIONS.name)
      public readonly authService: ClientProxy,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const authorization = request.headers.authorization;

      if (!authorization || !authorization.startsWith('Bearer ')) {
        return false;
      }

      const accessToken = authorization.slice(7, authorization.length);
      // Проверка валидности access токена
      let authInfo = await firstValueFrom(
        this.authService.send('session_verify_access_token', {accessToken, role})
      );

      if (!authInfo['authorized'])
        return false;

      request.userId = authInfo['id'];
      request.userRole = authInfo['role'];
      request.userSession = authInfo['session'];
      return true;
    }
  }
  return JwtAuthGuardMixin;
}