import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from "@nestjs/sequelize";
 
import { User } from './user.model';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ClientsModule } from "@nestjs/microservices";
import { rabbitmqConfig } from "@app/config";

@Module({
  imports: [
    JwtModule.register({}),
    SequelizeModule.forFeature([User]),
    ClientsModule.register([rabbitmqConfig.RMQ_AUTH_MODULE_OPTIONS])
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, SequelizeModule]
})
export class UserModule {}
