import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
 
  @ApiProperty({
    example: 'example@gmail.com',
    description: 'Электронная почта пользователя',
    format: 'email'
  })
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    example: 'pass12345',
    description: 'Пароль пользователя',
  })
  @IsNotEmpty()
  readonly password: string;
}
