import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Repository } from "sequelize-typescript";
import { ReviewModel } from "./models/review.model";
import { CommentModel } from "./models/comment.model";
import { ReviewDto } from "./dto/review.dto";
import { rabbitmqConfig } from "@app/config";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { ReviewStructureType } from "./common/review-structure-type";
import { QueryTypes } from "sequelize";
import { CommentDto } from "./dto/comment.dto";

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(ReviewModel)
    private readonly reviewRepository: Repository<ReviewModel>,
    @InjectModel(CommentModel)
    private readonly commentRepository: Repository<CommentModel>,
    @Inject(rabbitmqConfig.RMQ_PROFILE_MODULE_OPTIONS.name)
    private readonly profileService: ClientProxy
  ) {}

  async findReview(id: number) {
    return await this.reviewRepository.findByPk(id);
  }

  async findComment(id: number) {
    return await this.commentRepository.findByPk(id);
  }

  async getFlatReviews(movieId: number, limit: number, offset: number) {
    return await this.reviewRepository.findAll({
      where: {
        movieId
      },
      include: [{
        model: CommentModel,
        as: 'comments'
      }],
      limit,
      offset
    });
  }

  async getTreeReviews(movieId: number, limit: number, offset: number, maxDepth: number) {
    let reviews = await this.getFlatReviews(movieId, limit, offset);
    reviews = reviews.map((value) => value.dataValues);

    for (const review of reviews) {

      const commentMap = new Map<number, any>();
      const depthMap = new Map<number, number>();

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

  async getReviews(movieId: number, limit: number, offset: number, view: ReviewStructureType) {
    switch (view) {
      case ReviewStructureType.Flat:
        return this.getFlatReviews(movieId, limit, offset);
      case ReviewStructureType.Tree:
        return this.getTreeReviews(movieId, limit, offset, 1);
      case ReviewStructureType.TreeDeep:
        return this.getTreeReviews(movieId, limit, offset, Infinity);
    }
  }

  async createReview(data: ReviewDto, userId: number) {
    const profile = await firstValueFrom(
      this.profileService.send('profile_find_by_user_id', userId)
    );
    return await this.reviewRepository.create({
      date: new Date(),
      author: `${profile.name} ${profile.surname}`,
      userId,
      ...data
    });
  }

  async createComment(data: CommentDto, userId: number) {
    const profile = await firstValueFrom(
      this.profileService.send('profile_find_by_user_id', userId)
    );
    return await this.commentRepository.create({
      date: new Date(),
      author: `${profile.name} ${profile.surname}`,
      userId,
      ...data
    });
  }

  async deleteReview(id: number) {
    return await this.reviewRepository.destroy({ where: { id } });
  }

  async deleteComment(id: number) {
    return await this.commentRepository.destroy({ where: { id } });
  }
}
