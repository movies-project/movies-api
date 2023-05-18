import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token'
  })
  @IsNotEmpty()
  readonly refreshToken: string;
}
