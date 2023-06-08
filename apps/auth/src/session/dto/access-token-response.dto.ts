import { ApiProperty } from "@nestjs/swagger";

export class AccessTokenResponseDto {
  @ApiProperty({
    description: 'Токен доступа'
  })
  readonly accessToken: string;
}