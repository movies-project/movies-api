import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { ClientProxy } from "@nestjs/microservices";
import { Repository } from "sequelize-typescript";
import { firstValueFrom } from "rxjs";
import { rabbitmqConfig } from "@app/config";
import { ReviewStructureType } from "./common/review-structure-type";
import { CommentDto } from "./dto/comment.dto";
import { ReviewDto } from "./dto/review.dto";
import { Review } from "./models/review.model";
import { Comment } from "./models/comment.model";
import { ProfileSharedService } from "@app/profile-shared/profile-shared.service";

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectModel(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly profileSharedService: ProfileSharedService
  ) {}

  async findReview(reviewId: number): Promise<Review> {
    return await this.reviewRepository.findByPk(reviewId);
  }

  async findComment(reviewId: string, commentId: number): Promise<Comment> {
    return await this.commentRepository.findOne({
      where: { id: commentId, reviewId: reviewId }
    });
  }

  async getFlatReviews(movieId: number, limit: number, offset: number): Promise<Review[]> {
    return await this.reviewRepository.findAll({
      where: {
        movieId
      },
      include: [{
        model: Comment,
        as: 'comments'
      }],
      limit,
      offset
    });
  }

  async getTreeReviews(movieId: number, limit: number, offset: number, maxDepth: number): Promise<Review[]> {
    let reviews = await this.getFlatReviews(movieId, limit, offset);
    reviews = reviews.map((value) => value.dataValues);

    for (const review of reviews) {

      const commentMap = new Map<string, any>();
      const depthMap = new Map<string, number>();

      for (const comment of review.comments) {
        if (!comment.id)
          continue;
        commentMap.set(comment.id, { ...comment.dataValues, answers: [] } );

        // Этот код вычисления глубины комментария безопасен, так как
        // parent любого комментария находится в таблице БД раньше чем ответ на него
        const depth = !comment.parentId ? 1 : (depthMap.get(comment.parentId) || 0) + 1;
        depthMap.set(comment.id, depth);
      }

      const comments = [...commentMap.values()];
      for (const comment of comments) {
        if (!commentMap.has(comment.parentId))
          continue;

        let parentComment = commentMap.get(comment.parentId);

        // Поднимаем комментарий на уровень выше, если это необходимо по условию maxDepth
        while (depthMap.get(parentComment.id) >= maxDepth && parentComment.parentId) {
          parentComment = commentMap.get(parentComment.parentId);
        }

        parentComment.answers.push(comment);
      }

      // Удаляем комментарии-дубли с самого высокого уровня, у которых есть parentId,
      // так как код выше уже занес их на уровни ниже в answers
      review.comments = comments.filter((comment) => comment.parentId == null);

    }

    return reviews;
  }

  async getReviews(movieId: number, limit: number, offset: number, view: ReviewStructureType): Promise<Review[]> {
    switch (view) {
      case ReviewStructureType.Flat:
        return this.getFlatReviews(movieId, limit, offset);
      case ReviewStructureType.Tree:
        return this.getTreeReviews(movieId, limit, offset, 1);
      case ReviewStructureType.TreeDeep:
        return this.getTreeReviews(movieId, limit, offset, Infinity);
    }
  }

  async createReview(data: ReviewDto, userId: number): Promise<Review> {
    const profile = await this.profileSharedService.findByUserId(userId);
    return await this.reviewRepository.create({
      date: new Date(),
      author: `${profile.name} ${profile.surname}`,
      userId,
      ...data
    });
  }

  async createComment(data: CommentDto, userId: number): Promise<Comment> {
    const profile = await this.profileSharedService.findByUserId(userId);
    return await this.commentRepository.create({
      date: new Date(),
      author: `${profile.name} ${profile.surname}`,
      userId,
      ...data
    });
  }

  async deleteReview(reviewId: number): Promise<boolean> {
    return !!await this.reviewRepository.destroy({
      where: { id: reviewId }
    });
  }

  async deleteComment(reviewId: string, commentId: number): Promise<boolean> {
    return !!await this.commentRepository.destroy({
      where: { id: commentId, reviewId: reviewId }
    });
  }
}
