import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/core/database/prisma.service';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  async getMovies(params: {
    page: number;
    limit: number;
    category?: string;
    search?: string;
    subscriptionType?: 'free' | 'premium';
  }) {
    const { page, limit, category, search, subscriptionType } = params;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (subscriptionType) {
      if (subscriptionType === 'free') {
        where.subscriptionType = 'FREE';
      } else if (subscriptionType === 'premium') {
        where.subscriptionType = 'PREMIUM';
      }
    }

    if (category) {
      where.movieCategories = {
        some: {
          category: {
            name: { equals: category, mode: 'insensitive' },
          },
        },
      };
    }

    const [movies, total] = await Promise.all([
      this.prisma.movie.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          categories: { 
            include: {
              category: true,
            },
          },
          files: true, 
          reviews: true,
        },
      }),
      this.prisma.movie.count({ where }),
    ]);

    const formattedMovies = movies.map((movie) => ({
      id: movie.id,
      title: movie.title,
      slug: movie.slug,
      poster_url: movie.posterUrl,
      release_year: movie.releaseYear,
      rating: movie.rating,
      subscription_type: movie.subscriptionType.toLowerCase(),
      categories: movie.categories.map((mc) => mc.category.name), 
    }));

    return {
      movies: formattedMovies,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getMovieBySlug(slug: string, userId?: string) {
    const movie = await this.prisma.movie.findUnique({
      where: { slug },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        files: true,
        reviews: true,
      },
    });

    if (!movie) throw new Error('Movie not found');

    const isFavorite = userId
      ? await this.prisma.favorite.findFirst({
          where: {
            userId,
            movieId: movie.id,
          },
        }).then((fav) => !!fav)
      : false;

    const averageRating =
      movie.reviews.length > 0
        ? movie.reviews.reduce((sum, r) => sum + r.rating, 0) /
          movie.reviews.length
        : null;

    return {
      id: movie.id,
      title: movie.title,
      slug: movie.slug,
      description: movie.description,
      release_year: movie.releaseYear,
      duration_minutes: movie.durationMinutes,
      poster_url: movie.posterUrl,
      rating: movie.rating,
      subscription_type: movie.subscriptionType.toLowerCase(),
      view_count: movie.viewCount,
      is_favorite: isFavorite,
      categories: movie.categories.map((mc) => mc.category.name), 
      files: movie.files.map((file) => ({
        quality: file.quality,
        language: file.language,
        size_mb: null,
      })),
      reviews: {
        average_rating: averageRating,
        count: movie.reviews.length,
      },
    };
  }
}
