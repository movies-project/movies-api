import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ReviewService } from "./review.service";
import { Review } from "./models/review.model";
import { Comment } from "./models/comment.model";
import { ReviewDto } from "./dto/review.dto";
import { JwtAuthGuard } from "@app/guards/jwt.guard";
import { UpdateMovieDto } from "../movie/dto/update-movie.dto";
import { ResourceType, ReviewOwnerGuard } from "./guards/review-owner.guard";
import { ReviewType } from "./common/review-type";
import { ReviewStructureType } from "./common/review-structure-type";
import { apiConfig } from "@app/config/api.config";
import { CommentDto } from "./dto/comment.dto";

@ApiTags('Обзоры и комментарии')
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Поиск обзора по id' })
  @ApiResponse({ description: 'Обзор найден' })
  async findReview(@Param('id') id: number): Promise<Review> {
    return await this.reviewService.findReview(id);
  }

  @Get('comment/:id')
  @ApiOperation({ summary: 'Поиск комментария на обзор по id' })
  @ApiResponse({ description: 'Комментарий найден' })
  async findComment(@Param('id') id: number): Promise<Comment> {
    return await this.reviewService.findComment(id);
  }

  @Get('movie/:movieId')
  @ApiOperation({ summary: 'Список обзоров и комментариев' })
  @ApiResponse({ description: 'Получен список обзоров и комментариев' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Количество возвращенных обзоров' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Количество пропускаемых обзоров' })
  @ApiQuery({ name: 'view', required: false, enum: ReviewStructureType,
    description: '**Формат возвращаемых данных:**\n\n'
      + '1. **flat** - все комментарии находятся на одном уровне\n'
      + '2. **tree** - древовидная структура с одним вложением-ответом\n'
      + '3. **tree-deep** - полная древовидная структура со всеми вложениями\n\n'
      + 'Количество отображенных комментариев не будет зависить от формата выше'
  })
  async getReviewsByMovie(
    @Param('movieId') movieId: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query('view') view: ReviewStructureType
  ) {
    limit = Math.max(limit, apiConfig.REVIEW_LIST_LIMIT);
    return await this.reviewService.getReviews(+movieId, limit, offset, view);
  }

  @Post()
  @UseGuards(JwtAuthGuard())
  @ApiOperation({ summary: 'Создание обзора' })
  @ApiCreatedResponse({ description: 'Обзор создан' })
  @ApiBearerAuth()
  async createReview(@Body() data: ReviewDto, @Request() req): Promise<Review> {
    return await this.reviewService.createReview(data, req.userId);
  }

  @Post('/comment')
  @UseGuards(JwtAuthGuard())
  @ApiOperation({ summary: 'Создание комментария на обзор' })
  @ApiCreatedResponse({ description: 'Комментарий создан' })
  @ApiBearerAuth()
  async createComment(@Body() data: CommentDto, @Request() req): Promise<Comment> {
    return await this.reviewService.createComment(data, req.userId);
  }

  @Delete()
  @UseGuards(ReviewOwnerGuard(ResourceType.Comment))
  @ApiOperation({ summary: 'Удалить обзор' })
  @ApiResponse({ description: 'Обзор удален' })
  @ApiBearerAuth()
  async deleteReview(@Body() data: { id: number }) {
    return await this.reviewService.deleteReview(data.id);
  }

  @Delete('comment')
  @UseGuards(ReviewOwnerGuard(ResourceType.Comment))
  @ApiOperation({ summary: 'Удалить комментарий на обзор' })
  @ApiResponse({ description: 'Комметарий удален' })
  @ApiBearerAuth()
  async deleteComment(@Body() data: { id: number }) {
    return await this.reviewService.deleteComment(data.id);
  }
}
