import { UnauthorizedException } from "@nestjs/common";

export class InvalidAccessTokenException extends UnauthorizedException {
  constructor() {
    super('Невалидный токен доступа');
  }
}