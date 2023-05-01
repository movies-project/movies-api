import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "sequelize-typescript";
import { InjectModel } from "@nestjs/sequelize";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { rabbitmqConfig } from "@app/config";
import { ProfileModel } from "./profile.model";
import { ProfileRegistrationData } from "./dto/register.dto";

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(ProfileModel)
    private readonly profileRepository: Repository<ProfileModel>,
    @Inject(rabbitmqConfig.RMQ_AUTH_MODULE_OPTIONS.name)
    private readonly userService: ClientProxy,
  ) {}

  async create(data: ProfileRegistrationData) {
    // Произведем отбор необходимых данных (email, password) для создания пользователя
    const userData = { email: data.email, password: data.password };
    // Отправим запрос на создание пользователя на соответствующий микросервис
    const user = await firstValueFrom(
      this.userService.send('user_create',  userData)
    );

    // Создадим профиль в базе данных
    const userId = user.id;
    await this.profileRepository.create({...data, userId});
    return {userId};
  }
}
