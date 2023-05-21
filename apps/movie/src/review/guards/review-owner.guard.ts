import { ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { rabbitmqConfig } from "@app/config";
import { JwtAuthGuard } from "@app/guards/jwt.guard";
import { ReviewService } from "../review.service";

export enum ResourceType {
  Review,
  Comment
}

export function ReviewOwnerGuard(resourceType: ResourceType) {
  @Injectable()
  class ReviewOwnerGuardMixin extends JwtAuthGuard() {
    constructor(
      public readonly reviewService: ReviewService,
      @Inject(rabbitmqConfig.RMQ_AUTH_MODULE_OPTIONS.name)
      public readonly authService: ClientProxy
    ) {
      super(authService);
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
      if (!await super.canActivate(context))
        return false;

      const request = context.switchToHttp().getRequest();
      const userId = request.user.id;

      if (resourceType === ResourceType.Review) {
        const review = await this.reviewService.findReview(request.body.reviewId);
        if (!review) {
          throw new UnauthorizedException('review not found');
        }
        if (review.userId == userId) {
          throw new UnauthorizedException('user is not the owner of the review');
        }
      } else if (resourceType === ResourceType.Comment) {
        const comment = await this.reviewService.findComment(request.body.commentId);
        if (!comment) {
          throw new UnauthorizedException('comment not found');
        }
        if (comment.userId !== userId) {
          throw new UnauthorizedException('user is not the owner of the comment');
        }
      }
    }
  }

  return ReviewOwnerGuardMixin;
}