import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "sequelize-typescript";
import { InjectModel } from "@nestjs/sequelize";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
 
import { rabbitmqConfig } from "@app/config";
import { Profile } from "./profile.model";
import { ProfileRegistrationDto } from "./dto/profile-registration.dto";

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile)
    private readonly profileRepository: Repository<Profile>,
    @Inject(rabbitmqConfig.RMQ_AUTH_MODULE_OPTIONS.name)
    private readonly userService: ClientProxy,
  ) {}

  async createProfileAndUser(data: ProfileRegistrationDto) {
    // Произведем отбор необходимых данных (email, password) для создания пользователя
    const userData = { email: data.email, password: data.password };
    // Отправим запрос на создание пользователя на соответствующий микросервис
    const user = await firstValueFrom(
      this.userService.send('user_create',  userData)
    );

    // Создадим профиль в базе данных
    const userId = user.id;
    const profile = await this.profileRepository.create({...data, userId});
    return profile.id;
  }
}
