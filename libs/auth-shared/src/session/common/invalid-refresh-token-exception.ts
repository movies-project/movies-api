import { UnauthorizedException } from "@nestjs/common";

export class InvalidRefreshTokenException extends UnauthorizedException {
  constructor() {
    super('Невалидный токен обновления');
  }
}