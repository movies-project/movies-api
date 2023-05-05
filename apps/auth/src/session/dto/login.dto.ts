import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginData {
  @ApiProperty({
    example: 'example@gmail.com',
    description: 'Электронная почта пользователя',
    format: 'email'
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'pass12345',
    description: 'Пароль пользователя',
  })
  @IsNotEmpty()
  password: string;
}