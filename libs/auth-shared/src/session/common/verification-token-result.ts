import { Token } from "@app/auth-shared/session/interfaces/token.interface";

export enum VerificationTokenError {
  InvalidToken,
  InvalidTokenType,
  ForbiddenRole,
  ExpiredSession
}

export interface VerificationTokenResult {
  authorized: boolean;
  token?: Token;
  error?: VerificationTokenError;
}