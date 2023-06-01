import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { rabbitmqConfig } from "@app/config";
import { userPatterns } from "@app/microservices/auth/user.patterns";
import { User } from "@app/auth-shared/user/models/user.model";
import { CreateUserIdto } from "@app/auth-shared/user/internal-dto/create-user.idto";

@Injectable()
export class UserSharedService {
  constructor(
    @Inject(rabbitmqConfig.RMQ_AUTH_MODULE_OPTIONS.name)
    private readonly authService: ClientProxy,
  ) {}

  async createUser(data: CreateUserIdto): Promise<User> {
    return await firstValueFrom(
      this.authService.send(userPatterns.CREATE, data)
    );
  }

  async findByEmail(email: string): Promise<User> {
    return await firstValueFrom(
      this.authService.send(userPatterns.FIND_BY_EMAIL, email)
    );
  }
}