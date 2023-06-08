import { ApiProperty, PickType } from "@nestjs/swagger";
import { User } from "@app/auth-shared/user/models/user.model";

export class AuthCredentialsDto
  extends PickType(User, ['email'])
{
  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'pass12345',
  })
  readonly password: string;
}