import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'sequelize-typescript';
import { InjectModel } from "@nestjs/sequelize";
 
import { bcryptConfig } from "@app/config/bcrypt.config";
import { User } from "@app/auth-shared/user/models/user.model";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(email: string, password: string): Promise<User> {
    const saltRounds = bcryptConfig.AUTH_SALT_ROUNDS;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // возвращаем user
    return this.userRepository.create({
      email: email,
      passwordHash
    });
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: {id}
    });
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: {email}
    });
  }
}
