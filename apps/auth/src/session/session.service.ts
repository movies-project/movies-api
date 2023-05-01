import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import { JwtService } from "@nestjs/jwt";
import { InjectRedis } from "@liaoliaots/nestjs-redis";
import Redis from 'ioredis';
import { jwtConfig } from "@app/config/jwt.config";
import { redisConfig } from "@app/config/redis.config";
import { UserService } from "../user/user.service";
import { UserModel } from "../user/user.model";
import * as _ from 'lodash';

const ms = require('ms');

const ACCESS_TOKEN_TYPE = 'access token';
const REFRESH_TOKEN_TYPE = 'refresh token';

@Injectable()
export class SessionService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRedis(redisConfig.AUTH_REDIS_NAMESPACE)
    private readonly redis: Redis,
    private readonly userService: UserService
  ) {}

  private static getRefreshTokenRedisPrefix(userId: string, session: string) {
    return `refreshToken:${userId}:${session}`;
  }

  private static getBlacklistRedisPrefix(userId: string) {
    return `blackListSession:${userId}`;
  }

  async generateAccessToken(refreshToken: string) {
    const decoded = await this.verifyRefreshToken(refreshToken);

    const payload = {
      // Сохраняем все для данные из refreshToken, включая сессию
      ...(_.omit(decoded, ['iat', 'exp', 'type'])),
      type: ACCESS_TOKEN_TYPE
    };

    const options = jwtConfig.JWT_ACCESS_TOKEN_SIGN_OPTIONS;
    return this.jwtService.sign(payload, options);
  }

  async generateRefreshToken(user: UserModel) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      session: uuid.v4(), // Храним для возможности блокировки access токенов по сессии
      type: REFRESH_TOKEN_TYPE
    };
    const options = jwtConfig.JWT_REFRESH_TOKEN_SIGN_OPTIONS;
    const token = this.jwtService.sign(payload, options);

    // Сохраним refresh token в базу данных Redis, чтобы
    // иметь возможность в любой момент его отозвать
    const redisKey = SessionService.getRefreshTokenRedisPrefix(user.id.toString(), payload.session);
    await this.redis.set(redisKey, '');

    // Настроим автоматическое удаление ключа после истечения срока действия токена
    const refreshTokenExpiresIn = <string>jwtConfig.JWT_REFRESH_TOKEN_SIGN_OPTIONS.expiresIn;
    await this.redis.expire(redisKey, ms(refreshTokenExpiresIn));

    return token;
  }

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user)
      throw new UnauthorizedException();
    const passwordEquals = await bcrypt.compare(password, user.passwordHash);
    if (!passwordEquals)
      throw new UnauthorizedException();
    return this.generateRefreshToken(user);
  }

  async verifyAccessToken(accessToken: string, role: string) {
    const isSessionBlacklisted = async (userId: string, session: string) => {
      const redisBlacklistKey = SessionService.getBlacklistRedisPrefix(userId);
      const foundCount = await this.redis.sismember(redisBlacklistKey, session);
      return !!foundCount;
    }

    const verifyOptions = {
      secret: jwtConfig.JWT_ACCESS_TOKEN_SIGN_OPTIONS.secret
    }

    const decoded = this.jwtService.verify(accessToken, verifyOptions);

    if (decoded.type !== ACCESS_TOKEN_TYPE)
      throw new UnauthorizedException('invalid token type');
    if (role && role !== decoded.role)
      throw new ForbiddenException();
    if (await isSessionBlacklisted(decoded.id, decoded.session))
      throw new UnauthorizedException('session expired');

    return decoded;
  }

  async verifyRefreshToken(refreshToken: string) {
    const verifyOptions = {
      secret: jwtConfig.JWT_ACCESS_TOKEN_SIGN_OPTIONS.secret
    }

    const decoded = this.jwtService.verify(refreshToken, verifyOptions);

    if (decoded.type !== REFRESH_TOKEN_TYPE)
      throw new UnauthorizedException('invalid token type');

    // Проверим, есть ли refresh token в базе данных
    const redisKey = SessionService.getRefreshTokenRedisPrefix(decoded.id, decoded.session);
    if (!await this.redis.exists(redisKey))
      throw new UnauthorizedException('session expired');

    return decoded;
  }

  async logout(userId, userSession) {
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

  async logoutAll(userId) {
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