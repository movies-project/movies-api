import { Module } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import { postgresConfig, rabbitmqConfig } from "@app/config";
import { Review } from "./models/review.model";
import { Comment } from "./models/comment.model";
import { ReviewController } from "./review.controller";
import { ReviewService } from "./review.service";
import { ClientsModule } from "@nestjs/microservices";

@Module({
  imports: [
    SequelizeModule.forFeature([Review, Comment]),
    ClientsModule.register([
      rabbitmqConfig.RMQ_AUTH_MODULE_OPTIONS,
      rabbitmqConfig.RMQ_PROFILE_MODULE_OPTIONS
    ])
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
