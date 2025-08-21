import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Request } from 'express';
import { GetMoviesDto } from './dto/movies.dto';
import { SubscriptionType } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  async getMovies(@Query() query: GetMoviesDto) {
    const page = parseInt(String(query.page || '1'), 10);
    const limit = parseInt(String(query.limit || '20'), 10);

    let subscriptionType: SubscriptionType | undefined;

    if (query.subscriptionType) {
      const lowerType = query.subscriptionType.toLowerCase();
      if (lowerType === 'free') {
        subscriptionType = SubscriptionType.free;
      } else if (lowerType === 'premium') {
        subscriptionType = SubscriptionType.premium;
      }
    }

    const result = await this.moviesService.getMovies({
      page,
      limit,
      category: query.category,
      search: query.search,
      subscriptionType,
    });

    return {
      success: true,
      data: result,
    };
  }

  @Get(':slug')
  @UseGuards(AuthGuard('jwt'))
  async getMovieBySlug(@Param('slug') slug: string, @Req() req: Request) {
    try {
      const userId = (req.user as { id: string }).id;
      const movie = await this.moviesService.getMovieBySlug(slug, userId);
      return {
        success: true,
        data: movie,
      };
    } catch (error) {
      if (error.message === 'Movie not found') {
        return {
          success: false,
          message: 'Film topilmadi',
        };
      }
      return {
        success: false,
        message: 'Serverda xatolik yuz berdi',
      };
    }
  }
}
