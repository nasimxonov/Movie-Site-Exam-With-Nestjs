import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/common/core/database/prisma.service';
import { JwtAuthGuard } from 'src/common/guard/auth.guard';
import { v4 as uuidv4 } from 'uuid';

@Controller('movies/:movie_id/reviews')
export class ReviewController {
  constructor(private prisma: PrismaService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createReview(
    @Param('movie_id') movieId: string,
    @Body('rating') rating: number,
    @Body('comment') comment: string,
    @Req() req: Request,
  ) {
    const user = req.user as { id: string; username: string };

    const review = await this.prisma.review.create({
      data: {
        id: uuidv4(),
        userId: user.id,
        movieId: movieId,
        rating: rating,
        comment: comment,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return {
      success: true,
      message: "comment muvaffaqiyatli qo'shildi",
      data: review,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':review_id')
  async deleteReview(
    @Param('movie_id') movieId: string,
    @Param('review_id') reviewId: string,
    @Req() req: Request,
  ) {
    const user = req.user as { id: string };

    const review = await this.prisma.review.findFirst({
      where: {
        id: reviewId,
        movieId: movieId,
        userId: user.id,
      },
    });

    if (!review) {
      return {
        success: false,
        message: 'comment topilmadi yoki sizga tegishli emas',
      };
    }

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
