import { PrismaService } from 'src/common/core/database/prisma.service';
import { CreateReviewDto } from './dto.review.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async createReview(movieId: string, userId: string, dto: CreateReviewDto) {
    const review = await this.prisma.review.create({
      data: {
        movieId,
        userId,
        rating: dto.rating,
        comment: dto.comment,
      },
      include: {
        user: {
          select: { id: true, username: true },
        },
      },
    });

    return {
      success: true,
      message: "commnet muvaffaqiyatli qo'shildi",
      data: review,
    };
  }

  async deleteReview(movieId: string, reviewId: string) {
    await this.prisma.review.delete({
      where: {
        id: reviewId,
      },
    });

    return {
      success: true,
      message: "comment muvaffaqiyatli o'chirildi",
    };
  }
}
