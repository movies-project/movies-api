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
import {ReviewDto} from "./dto/review.dto";
import {ResourceType, ReviewOwnerGuard} from "./guards/review-owner.guard";
import {ReviewStructureType} from "./common/review-structure-type";
import {CommentDto} from "./dto/comment.dto";
import {reviewConfig} from "./config/review.config";
import {LimitValidationPipe} from "@app/pipes/limit-validation.pipe";
import {JwtAuthGuard} from "@app/auth-shared/session/guards/jwt.guard";


@ApiTags('Обзоры и комментарии')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('/:reviewId')
  @ApiOperation({ summary: 'Поиск обзора по id' })
  @ApiOkResponse({ description: 'Обзор найден' })
  @ApiNotFoundResponse({ description: 'Обзор не найден' })
  @ApiParam({ name: 'reviewId', required: true, type: Number, description: 'Идентификатор обзора' })
  async findReview(@Param('reviewId') reviewId: number): Promise<Review> {
    const review = await this.reviewService.findReview(reviewId);
    if (!review)
      throw new NotFoundException('Обзор не найден');
    return review;
  }

  @Get('/:reviewId/comments/:commentId')
  @ApiOperation({ summary: 'Поиск комментария на обзор по id' })
  @ApiOkResponse({ description: 'Комментарий найден' })
  @ApiNotFoundResponse({ description: 'Комментарий не найден' })
  @ApiParam({ name: 'reviewId', required: true, type: Number, description: 'Идентификатор обзора' })
  @ApiParam({ name: 'commentId', required: true, type: Number, description: 'Идентификатор комментария' })
  async findComment(@Param() params): Promise<Comment> {
    const { reviewId, commentId } = params;
    const comment = await this.reviewService.findComment(reviewId, commentId);
    if (!comment)
      throw new NotFoundException('Комментарий не найден');
    return comment;
  }

  @Get()
  @UsePipes(new LimitValidationPipe(
      reviewConfig.REVIEW_LIST_LIMIT.minLimit,
      reviewConfig.REVIEW_LIST_LIMIT.maxLimit))
  @ApiOperation({ summary: 'Список обзоров и комментариев' })
  @ApiOkResponse({ description: 'Получен список обзоров и комментариев' })
  @ApiQuery({ name: 'movieId', required: true, type: Number, description: 'Идентификатор фильма' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Количество возвращенных обзоров' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Количество пропускаемых обзоров' })
  @ApiQuery({ name: 'view', required: false, enum: ReviewStructureType,
    description: '**Формат возвращаемых данных:**\n\n'
      + '1. **flat** - все комментарии находятся на одном уровне\n'
      + '2. **tree** - древовидная структура с одним вложением-ответом\n'
      + '3. **tree-deep** - полная древовидная структура со всеми вложениями\n\n'
      + 'Количество отображенных комментариев не будет зависеть от формата выше'
  })
  async getReviewsByMovie(
    @Query('movieId') movieId: number,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query('view') view: ReviewStructureType): Promise<Review[]> {
    return await this.reviewService.getReviews(movieId, limit, offset, view);
  }

  @Post()
  @JwtAuthGuard()
  @ApiOperation({ summary: 'Создание обзора' })
  @ApiCreatedResponse({ description: 'Обзор создан' })
  @ApiBearerAuth()
  async createReview(@Body() data: ReviewDto, @Request() req): Promise<Review> {
    return await this.reviewService.createReview(data, req.userId);
  }

  @Post('/:reviewId/comments')
  @JwtAuthGuard()
  @ApiOperation({ summary: 'Создание комментария на обзор' })
  @ApiCreatedResponse({ description: 'Комментарий создан' })
  @ApiBearerAuth()
  @ApiParam({ name: 'reviewId', required: true, type: Number, description: 'Идентификатор обзора' })
  async createComment(@Body() data: CommentDto, @Request() req): Promise<Comment> {
    return await this.reviewService.createComment(data, req.userId);
  }

  @Delete('/:reviewId')
  @HttpCode(204)
  @ReviewOwnerGuard(ResourceType.Comment)
  @ApiOperation({ summary: 'Удалить обзор' })
  @ApiNoContentResponse({ description: 'Обзор удален' })
  @ApiNotFoundResponse({ description: 'Обзор не найден' })
  @ApiParam({ name: 'reviewId', required: true, type: Number, description: 'Идентификатор обзора' })
  @ApiBearerAuth()
  async deleteReview(@Param('reviewId') reviewId: number): Promise<void> {
    const result: boolean = await this.reviewService.deleteReview(reviewId);
    if (!result)
      throw new NotFoundException('Обзор не найден');
  }

  @Delete('/:reviewId/comments/:commentId')
  @HttpCode(204)
  @ReviewOwnerGuard(ResourceType.Comment)
  @ApiOperation({ summary: 'Удалить комментарий на обзор' })
  @ApiNoContentResponse({ description: 'Комментарий удален' })
  @ApiNotFoundResponse({ description: 'Комментарий не найден' })
  @ApiParam({ name: 'reviewId', required: true, type: Number, description: 'Идентификатор обзора' })
  @ApiParam({ name: 'commentId', required: true, type: Number, description: 'Идентификатор комментария' })
  @ApiBearerAuth()
  async deleteComment(@Param() params): Promise<void> {
    const { reviewId, commentId } = params;
    const result: boolean = await this.reviewService.deleteComment(
      reviewId,
      commentId
    );
    if (!result)
      throw new NotFoundException('Комментарий не найден');
  }
}
