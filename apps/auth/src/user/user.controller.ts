import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import { MessagePattern, Payload } from '@nestjs/microservices';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from "@app/guards/jwt.guard";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('Пользователи')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard())
  @ApiOperation({ summary: 'Получение собственных пользовательских данных' })
  @ApiOkResponse({ description: 'Успешное получение пользовательских данных' })
  @ApiBearerAuth()
  async findOne(@Request() req) {
    const userInfo = req['user'];
    const user = await this.userService.findOne(userInfo.id);
    const {passwordHash, ...userWithSafeFields} = user.dataValues;
    return userWithSafeFields;
  }

  @MessagePattern('user_create')
  async create(@Payload() userDto: CreateUserDto) {
    return this.userService.create(userDto);
  }
}
