import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'sequelize-typescript';
import { InjectModel } from "@nestjs/sequelize";
 
import { bcryptConfig } from "@app/config/bcrypt.config";
import { User } from "./user.model";
import {CreateUserDto} from "./dto/create-user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userDto: CreateUserDto) {
    const saltRounds = bcryptConfig.AUTH_SALT_ROUNDS;
    const passwordHash = await bcrypt.hash(userDto.password, saltRounds);

    // возвращаем user
    return this.userRepository.create({
      email: userDto.email,
      passwordHash
    });
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: {email}
    });
    if (!user)
      throw new NotFoundException();
    return user;
  }
}
