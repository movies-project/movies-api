import { ApiProperty } from "@nestjs/swagger";

export class AuthCredentialsDto {
  @ApiProperty({
    description: 'Электронная почта пользователя',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'pass12345',
  })
  password: string;
}