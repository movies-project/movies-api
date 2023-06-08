import { TokenPair } from "@app/auth-shared/session/interfaces/token-pair.interface";
import { ApiProperty } from "@nestjs/swagger";

export class TokenPairResponseDto implements TokenPair {
  @ApiProperty({
    description: 'Токен обновления'
  })
  readonly refreshToken: string;

  @ApiProperty({
    description: 'Токен доступа'
  })
  readonly accessToken: string;
}