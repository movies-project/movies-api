import { ApiProperty } from "@nestjs/swagger";
import { TokenPair } from "@app/auth-shared/session/interfaces/token-pair.interface";

export class AuthResponseDto implements TokenPair {
  @ApiProperty({
    description: 'Refresh token'
  })
  refreshToken: string;

  @ApiProperty({
    description: 'Access token'
  })
  accessToken: string;
}