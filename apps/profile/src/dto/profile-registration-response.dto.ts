import { ApiProperty } from "@nestjs/swagger";
import { TokenPair } from "@app/auth-shared/session/interfaces/token-pair.interface";
import { TokenPairResponseDto } from "@app/auth-shared/session/dto/token-pair-response.dto";
import { Profile } from "@app/profile-shared/models/profile.model";
import { User } from "@app/auth-shared/user/models/user.model";

export class ProfileRegistrationResponseDto {
  @ApiProperty({
    description: 'Токены: refresh и access',
    type: TokenPairResponseDto
  })
  readonly tokens: TokenPair;

  @ApiProperty({
    description: 'Профиль',
    type: Profile
  })
  readonly profile: Profile;

  @ApiProperty({
    description: 'Пользователь',
    type: User
  })
  readonly user: User;
}
