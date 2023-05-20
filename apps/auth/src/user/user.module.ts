import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from "@nestjs/sequelize";
 
import { User } from './user.model';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    JwtModule.register({})
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, SequelizeModule]
})
export class UserModule {}
