import { TokenPair } from "@app/auth-shared/session/interfaces/token-pair.interface";

export class AuthResponseIdto implements TokenPair {
  readonly refreshToken: string;

  readonly accessToken: string;
}