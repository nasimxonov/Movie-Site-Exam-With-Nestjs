import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/core/database/prisma.service';

@Injectable()
export class FavoriteService {
  constructor(private prisma: PrismaService) {}

  async getFavorites(userId: string) {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      include: {
        movie: true,
      },
    });

    const movies = favorites.map((fav) => ({
      id: fav.movie.id,
      title: fav.movie.title,
      slug: fav.movie.slug,
      poster_url: fav.movie.posterUrl,
      release_year: fav.movie.releaseYear,
      rating: Number(fav.movie.rating),
      subscription_type: fav.movie.subscriptionType.toLowerCase(),
    }));

    const total = await this.prisma.favorite.count({
      where: { userId },
    });

    return {
      movies,
      total,
    };
  }

  async addFavorite(userId: string, movieId: string) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie) throw new Error('Movie not found');

    const existing = await this.prisma.favorite.findFirst({
      where: { userId, movieId },
    });

    if (existing) {
      return existing; 
    }

    const favorite = await this.prisma.favorite.create({
      data: {
        userId,
        movieId,
      },
      include: {
        movie: true,
      },
    });

    return {
      id: favorite.id,
      movie_id: favorite.movieId,
      movie_title: favorite.movie.title,
      created_at: favorite.createdAt.toISOString(),
    };
  }

  async removeFavorite(userId: string, movieId: string) {
    const existing = await this.prisma.favorite.findFirst({
      where: { userId, movieId },
    });

    if (!existing) throw new Error('Favorite not found');

    await this.prisma.favorite.delete({
      where: { id: existing.id },
    });

    return;
  }
}
