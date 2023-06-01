import { Token } from "@app/auth-shared/session/interfaces/token.interface";

export class VerifyAccessTokenResponseIdto {
  readonly authorized: boolean;

  readonly token: Token;
}