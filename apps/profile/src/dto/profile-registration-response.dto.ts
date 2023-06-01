import { TokenPair } from "@app/auth-shared/session/interfaces/token-pair.interface";
import { Profile } from "@app/profile-shared/models/profile.model";

export class ProfileRegistrationResponseDto {
  readonly tokens: TokenPair;
  readonly profile: Profile;
  readonly user: any;
}
