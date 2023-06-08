import { ApiProperty} from "@nestjs/swagger";

export class RefreshTokenDto  {
  @ApiProperty({
    description: 'Токен обновления'
  })
  readonly refreshToken: string;
}