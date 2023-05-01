import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from "@nestjs/sequelize";
import { UserModel } from './user.model';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    SequelizeModule.forFeature([UserModel]),
    JwtModule.register({})
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, SequelizeModule]
})
export class UserModule {}