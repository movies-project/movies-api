import { Injectable } from "@nestjs/common";
import * as uuid from "uuid";
import { JwtService } from "@nestjs/jwt";
import { InjectRedis } from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";
import * as _ from "lodash";

import { jwtConfig } from "@app/config/jwt.config";
import { redisConfig } from "@app/config/redis.config";
import { Token, TokenType, TokenUser } from "@app/auth-shared/session/interfaces/token.interface";
import { User } from "@app/auth-shared/user/models/user.model";
import { TokenPair } from "@app/auth-shared/session/interfaces/token-pair.interface";
import {
  VerificationTokenError,
  VerificationTokenResult
} from "@app/auth-shared/session/common/verification-token-result";

const ms = require('ms');

@Injectable()
export class SessionService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRedis(redisConfig.AUTH_REDIS_NAMESPACE)
    private readonly redis: Redis
  ) {}

  private static getRefreshTokenRedisPrefix(userId: number, session: string): string {
    return `refreshToken:${userId}:${session}`;
  }

  private static getBlacklistRedisPrefix(userId: number): string {
    return `blackListSession:${userId}`;
  }

  async generateAccessToken(refreshToken: string): Promise<string> {
    // Раскодируем токен
    const { token: decodedRefreshToken } = await this.verifyRefreshToken(refreshToken);

    const payload = {
      // Сохраняем все данные пользователя из refreshToken, включая сессию
      ...(_.omit(decodedRefreshToken, ['iat', 'exp', 'type'])),
      type: TokenType.AccessToken
    };

    const options = jwtConfig.JWT_ACCESS_TOKEN_SIGN_OPTIONS;
    return this.jwtService.sign(payload, options);
  }

  async generateRefreshToken(user: User): Promise<string> {
    const payload = <Token>{
      user: <TokenUser>{
        id: user.id,
        email: user.email,
        role: user.role
      },
      session: uuid.v4(), // Храним для возможности блокировки access токенов по сессии
      type: TokenType.RefreshToken
    };
    const options = jwtConfig.JWT_REFRESH_TOKEN_SIGN_OPTIONS;
    const token = this.jwtService.sign(payload, options);

    // Сохраним refresh token в базу данных Redis, чтобы
    // иметь возможность в любой момент его отозвать
    const redisKey = SessionService.getRefreshTokenRedisPrefix(user.id, payload.session);
    await this.redis.set(redisKey, '');

    // Настроим автоматическое удаление ключа после истечения срока действия токена
    const refreshTokenExpiresIn = <string>jwtConfig.JWT_REFRESH_TOKEN_SIGN_OPTIONS.expiresIn;
    await this.redis.expire(redisKey, ms(refreshTokenExpiresIn));

    return token;
  }

  async login(user: User): Promise<TokenPair> {
    const refreshToken = await this.generateRefreshToken(user);
    const accessToken = await this.generateAccessToken(refreshToken);

    return {
      refreshToken,
      accessToken
    };
  }

  async verifyAccessToken(accessToken: string, role: string): Promise<VerificationTokenResult> {
    const isSessionBlacklisted = async (userId: number, session: string) => {
      const redisBlacklistKey = SessionService.getBlacklistRedisPrefix(userId);
      const countBlockedSessions = await this.redis.sismember(redisBlacklistKey, session);
      return Boolean(countBlockedSessions);
    }

    const verifyOptions = {
      secret: jwtConfig.JWT_ACCESS_TOKEN_SIGN_OPTIONS.secret
    }

    // Раскодируем токен
    let decodedAccessToken;
    try {
      decodedAccessToken = <Token>this.jwtService.verify(accessToken, verifyOptions);
    } catch {
      return { authorized: false, error: VerificationTokenError.InvalidToken };
    }

    if (decodedAccessToken.type !== TokenType.AccessToken)
      return { authorized: false, error: VerificationTokenError.InvalidTokenType };
    if (role && (role !== decodedAccessToken.user.role))
      return { authorized: false, error: VerificationTokenError.ForbiddenRole } ;
    if (await isSessionBlacklisted(decodedAccessToken.user.id, decodedAccessToken.session))
      return { authorized: false, error: VerificationTokenError.ExpiredSession };

    return { authorized: true, token: decodedAccessToken };
  }

  async verifyRefreshToken(refreshToken: string): Promise<VerificationTokenResult> {
    const verifyOptions = {
      secret: jwtConfig.JWT_ACCESS_TOKEN_SIGN_OPTIONS.secret
    }

    // Раскодируем токен
    let decodedRefreshToken;
    try {
      decodedRefreshToken = <Token>this.jwtService.verify(refreshToken, verifyOptions);
    } catch {
      return { authorized: false, error: VerificationTokenError.InvalidToken };
    }

    if (decodedRefreshToken.type !== TokenType.RefreshToken)
      return { authorized: false, error: VerificationTokenError.InvalidTokenType };

    // Проверим, есть ли refresh token в базе данных
    const redisKey = SessionService.getRefreshTokenRedisPrefix(
        decodedRefreshToken.user.id,
        decodedRefreshToken.session
    );

    if (!await this.redis.exists(redisKey))
      return { authorized: false, error: VerificationTokenError.ExpiredSession };

    return { authorized: true, token: decodedRefreshToken };
  }

  async logout(userId, userSession): Promise<void> {
    // Удалим refresh token из базы данных Redis
    const redisRefreshTokenKey = SessionService.getRefreshTokenRedisPrefix(userId, userSession);
    await this.redis.del(redisRefreshTokenKey);

    // Добавим сессию в черный список для инвалидации всех access токенов
    const redisBlacklistKey = SessionService.getBlacklistRedisPrefix(userId);
    const accessTokenExpiresIn = <string>jwtConfig.JWT_ACCESS_TOKEN_SIGN_OPTIONS.expiresIn;
    await this.redis.sadd(redisBlacklistKey, userSession);

    // Настроим автоматическое удаление ключа из черного списка сессий
    await this.redis.expire(redisBlacklistKey, ms(accessTokenExpiresIn));
  }

  async logoutAll(userId): Promise<void> {
    // Производим поиск refresh токенов по id пользователя в базе данных Redis
    const redisRefreshTokenMask = SessionService.getRefreshTokenRedisPrefix(userId, '*');
    let cursor = '0';
    let elements;
    do {
      [cursor, elements] = await this.redis.scan(
        cursor,
        'MATCH',
        redisRefreshTokenMask,
        'COUNT',
        100
      );
      for (const element of elements) {
        let foundSession = element.split(':').slice(-1)[0];
        await this.logout(userId, foundSession);
      }
    } while (cursor !== '0');
  }
}
