import { Module } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import { Review } from "./models/review.model";
import { Comment } from "./models/comment.model";
import { ReviewController } from "./review.controller";
import { ReviewService } from "./review.service";
import { ProfileSharedModule } from "@app/profile-shared/profile-shared.module";
import { AuthSharedModule } from "@app/auth-shared/auth-shared.module";

@Module({
  imports: [
    SequelizeModule.forFeature([Review, Comment]),
    ProfileSharedModule,
    AuthSharedModule
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
