import {
  applyDecorators,
  Injectable,
  UseGuards,
  ExecutionContext,
  ForbiddenException,
  NotFoundException
} from "@nestjs/common";
import { ApiForbiddenResponse, ApiNotFoundResponse, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { JwtAuthGuardMixin } from "@app/auth-shared/session/guards/jwt.guard";
import { AuthenticatedRequest } from "@app/auth-shared/session/interfaces/authenticated-request.interface";
import { SessionSharedService } from "@app/auth-shared/session/session-shared.service";
import { ReviewService } from "../review.service";

export enum ResourceType {
  Review,
  Comment
}

export function ReviewOwnerGuard(resourceType: ResourceType) {
  @Injectable()
  class ReviewOwnerGuardMixin extends JwtAuthGuardMixin {
    constructor(
      public readonly sessionSharedService: SessionSharedService,
      public readonly reviewService: ReviewService
    ) {
      super(sessionSharedService);
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
      if (!await super.canActivate(context))
        return false;

      const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

      if (resourceType === ResourceType.Review) {
        const review = await this.reviewService.findReview(request.body.reviewId);
        if (!review) {
          throw new NotFoundException('Отзыв не найден');
        }
        if (review.userId == request.accessTokenData.user.id) {
          throw new ForbiddenException('Доступ к отзыву запрещен');
        }
      } else if (resourceType === ResourceType.Comment) {
        const comment = await this.reviewService.findComment(request.body.reviewId, request.body.commentId);
        if (!comment) {
          throw new NotFoundException('Комментарий не найден');
        }
        if (comment.userId !== request.accessTokenData.user.id) {
          throw new ForbiddenException('Доступ к комментарию запрещен');
        }
      }
    }
  }

  // Добавляем ошибки 401, 403, 404 для документации Swagger
  return applyDecorators(
    UseGuards(ReviewOwnerGuardMixin),
    ApiUnauthorizedResponse( { description: 'Невалидный токен доступа' }),
    ApiNotFoundResponse({ description: 'Отзыв/комментарий не найден' }),
    ApiForbiddenResponse({ description: 'Доступ к отзыву/комментарию запрещен' })
  );
}
