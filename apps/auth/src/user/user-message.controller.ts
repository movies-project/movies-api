import { MessagePattern, Payload } from "@nestjs/microservices";
import { Controller } from "@nestjs/common";

import { userPatterns } from "@app/microservices/auth/user.patterns";
import { CreateUserIdto } from "@app/auth-shared/user/internal-dto/create-user.idto";
import { User } from "@app/auth-shared/user/models/user.model";
import { UserService } from "./user.service";

@Controller('user-message')
export class UserMessageController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(userPatterns.CREATE)
  async create(@Payload() userDto: CreateUserIdto): Promise<User> {
    return await this.userService.create(userDto.email, userDto.password);
  }

  @MessagePattern(userPatterns.FIND_BY_EMAIL)
  async findByEmail(@Payload() email: string): Promise<User> {
    return await this.userService.findByEmail(email);
  }
}