import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
  Request,
  UsePipes
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags
} from "@nestjs/swagger";
import {ApiNoContentResponse} from "@nestjs/swagger/dist/decorators/api-response.decorator";

import {ReviewService} from "./review.service";
import {Review} from "./models/review.model";
import {Comment} from "./models/comment.model";
import {CreateReviewDto} from "./dto/create-review.dto";
import {ResourceType, ReviewOwnerGuard} from "./guards/review-owner.guard";
import {ReviewStructureType} from "./common/review-structure-type";
import {reviewConfig} from "./config/review.config";
import {LimitValidationPipe} from "@app/pipes/limit-validation.pipe";
import {JwtAuthGuard} from "@app/auth-shared/session/guards/jwt.guard";
import {AuthenticatedRequest} from "@app/auth-shared/session/interfaces/authenticated-request.interface";
import { CreateCommentDto } from "./dto/create-comment.dto";


@ApiTags('Отзывы и комментарии')
@Controller('reviews')
export class ReviewController {

  constructor(private readonly reviewService: ReviewService) {
  }

  @Get('/:reviewId')
  @ApiOperation({summary: 'Поиск отзыва по id'})
  @ApiOkResponse({
    description: 'Отзыв найден',
    type: Review
  })
  @ApiNotFoundResponse({description: 'Отзыв не найден'})
  @ApiParam({
    name: 'reviewId', required: true, type: Number,
    description: 'Идентификатор отзыва'
  })
  async findReview(@Param('reviewId') reviewId: number): Promise<Review> {
    const review = await this.reviewService.findReview(reviewId);
    if (!review)
      throw new NotFoundException('Отзыв не найден');
    return review;
  }

  @Get('/:reviewId/comments/:commentId')
  @ApiOperation({summary: 'Поиск комментария на отзыв по id'})
  @ApiOkResponse({
    description: 'Комментарий найден',
    type: Comment
  })
  @ApiNotFoundResponse({description: 'Комментарий не найден'})
  @ApiParam({
    name: 'reviewId', required: true, type: Number,
    description: 'Идентификатор отзыва'
  })
  @ApiParam({
    name: 'commentId', required: true, type: Number,
    description: 'Идентификатор комментария'
  })
  async findComment(@Param() params): Promise<Comment> {
    const {reviewId, commentId} = params;
    const comment = await this.reviewService.findComment(reviewId, commentId);
    if (!comment)
      throw new NotFoundException('Комментарий не найден');
    return comment;
  }

  @Get()
  @UsePipes(new LimitValidationPipe(
      reviewConfig.REVIEW_LIST_LIMIT.minLimit,
      reviewConfig.REVIEW_LIST_LIMIT.maxLimit))
  @ApiOperation({summary: 'Список отзывов и комментариев'})
  @ApiOkResponse({
    description: 'Получен список отзывов и комментариев',
    type: [Review]
  })
  @ApiQuery({
    name: 'movieId', required: true, type: Number,
    description: 'Идентификатор фильма'
  })
  @ApiQuery({
    name: 'limit', required: false, type: Number,
    description: 'Количество возвращенных отзывов'
  })
  @ApiQuery({
    name: 'offset', required: false, type: Number,
    description: 'Количество пропускаемых отзывов'
  })
  @ApiQuery({
    name: 'view', required: false, enum: ReviewStructureType,
    description: '**Формат возвращаемых данных:**\n\n' +
        '1. **flat** - все комментарии находятся на одном уровне\n' +
        '2. **tree** - древовидная структура с одним вложением-ответом\n' +
        '3. **tree-deep** - полная древовидная структура со всеми вложениями\n\n' +
        'Количество отображенных комментариев не будет зависеть от формата выше'
  })
  async getReviewsByMovie(
      @Query('movieId') movieId: number,
      @Query('limit') limit: number,
      @Query('offset') offset: number,
      @Query('view') view: ReviewStructureType = ReviewStructureType.Flat): Promise<Review[]> {
    return await this.reviewService.getReviews(movieId, limit, offset, view);
  }

  @Post()
  @JwtAuthGuard()
  @ApiOperation({summary: 'Создание отзыва'})
  @ApiCreatedResponse({
    description: 'Отзыв создан',
    type: Review
  })
  @ApiBearerAuth()
  async createReview(@Body() data: CreateReviewDto,
                     @Request() req: AuthenticatedRequest): Promise<Review> {
    return await this.reviewService.createReview(data, req.accessTokenData.user.id);
  }

  @Post('/:reviewId/comments')
  @JwtAuthGuard()
  @ApiOperation({summary: 'Создание комментария на отзыв'})
  @ApiCreatedResponse({
    description: 'Комментарий создан',
    type: Comment
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'reviewId', required: true, type: Number,
    description: 'Идентификатор отзыва'
  })
  async createComment(@Param('reviewId') reviewId: number,
                      @Body() data: CreateCommentDto,
                      @Request() req: AuthenticatedRequest): Promise<Comment> {
    return await this.reviewService.createComment(reviewId, data, req.accessTokenData.user.id);
  }

  @Delete('/:reviewId')
  @HttpCode(204)
  @ReviewOwnerGuard(ResourceType.Comment)
  @ApiOperation({summary: 'Удалить отзыв'})
  @ApiNoContentResponse({description: 'Отзыв удален'})
  @ApiNotFoundResponse({description: 'Отзыв не найден'})
  @ApiParam({
    name: 'reviewId', required: true, type: Number,
    description: 'Идентификатор отзыва'
  })
  @ApiBearerAuth()
  async deleteReview(@Param('reviewId') reviewId: number): Promise<void> {
    const result: boolean = await this.reviewService.deleteReview(reviewId);
    if (!result)
      throw new NotFoundException('Отзыв не найден');
  }

  @Delete('/:reviewId/comments/:commentId')
  @HttpCode(204)
  @ReviewOwnerGuard(ResourceType.Comment)
  @ApiOperation({summary: 'Удалить комментарий на отзыв'})
  @ApiNoContentResponse({description: 'Комментарий удален'})
  @ApiNotFoundResponse({description: 'Комментарий не найден'})
  @ApiParam({
    name: 'reviewId', required: true, type: Number,
    description: 'Идентификатор отзыва'
  })
  @ApiParam({
    name: 'commentId', required: true, type: Number,
    description: 'Идентификатор комментария'
  })
  @ApiBearerAuth()
  async deleteComment(@Param() params): Promise<void> {
    const {reviewId, commentId} = params;
    const result: boolean = await this.reviewService.deleteComment(
        reviewId,
        commentId
    );
    if (!result)
      throw new NotFoundException('Комментарий не найден');
  }
}
