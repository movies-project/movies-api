import { JwtSignOptions } from "@nestjs/jwt/dist/interfaces";

export const jwtConfig = {
  JWT_ACCESS_TOKEN_SIGN_OPTIONS: <JwtSignOptions>{
    secret: process.env.PRIVATE_AUTH_KEY || 'SECRET',
    expiresIn: '30m'
  },

  JWT_REFRESH_TOKEN_SIGN_OPTIONS: <JwtSignOptions>{
    secret: process.env.PRIVATE_AUTH_KEY || 'SECRET',
    expiresIn: '30d'
  },
}