import { Injectable } from "@nestjs/common";
import { Repository } from "sequelize-typescript";
import { InjectModel } from "@nestjs/sequelize";

import { Profile } from "@app/profile-shared/models/profile.model";
import { SessionSharedService } from "@app/auth-shared/session/session-shared.service";
import { UserSharedService } from "@app/auth-shared/user/user-shared.service";
import { ProfileRegistrationResponseDto } from "./dto/profile-registration-response.dto";
import { ProfileRegistrationDto } from "./dto/profile-registration.dto";

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly userSharedService: UserSharedService,
    private readonly sessionSharedService: SessionSharedService
  ) {}

  async createProfileAndUser(data: ProfileRegistrationDto): Promise<ProfileRegistrationResponseDto> {
    // Произведем отбор необходимых данных (email, password) для создания пользователя
    const userData = { email: data.email, password: data.password };
    // Отправим запрос на создание пользователя на соответствующий микросервис
    const user =  await this.userSharedService.createUser(userData);
    const { passwordHash, ...userWithSafeFields } = user;

    // Создадим профиль в базе данных
    const userId = user.id;
    const profile = await this.profileRepository.create({...data, userId});

    // Автоматический вход пользователя в аккаунт
    const tokens = await this.sessionSharedService.login(user);

    return {
      tokens,
      profile,
      user: userWithSafeFields
    };
  }

  async findByUserId(userId: number): Promise<Profile> {
    return await this.profileRepository.findOne({ where: { userId} });
  }
}
