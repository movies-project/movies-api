import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('user_create')
  async create(@Payload() data: { email: string, password: string }) {
    return this.userService.create(data.email, data.password);
  }
}