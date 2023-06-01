export enum TokenType {
  AccessToken = 'access token',
  RefreshToken = 'refresh token',
}

export interface TokenUser {
  id: number,
  email: string,
  role: string
}

export interface Token {
  user: TokenUser;
  session: string;
  type: TokenType;
}