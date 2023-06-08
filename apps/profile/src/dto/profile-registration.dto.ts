import { MaxLength, MinLength } from "class-validator";
import { ApiProperty, IntersectionType, PickType } from "@nestjs/swagger";
import { User } from "@app/auth-shared/user/models/user.model";
import { Profile } from "@app/profile-shared/models/profile.model";

export class ProfileRegistrationDto
  extends IntersectionType(
    PickType(User, ['email']),
    PickType(Profile,['name', 'surname', 'phoneNumber', 'selfDescription'])
  )
{
  @ApiProperty({
    example: 'pass12345',
    description: 'Пароль пользователя',
  })
  @MinLength(8)
  @MaxLength(256)
  readonly password: string;
}
