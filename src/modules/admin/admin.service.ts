import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/core/database/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Prisma, VideoQuality } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllMovies() {
    const movies = await this.prisma.movie.findMany();
    return { success: true, data: { movies, total: movies.length } };
  }

  async createMovie(
    dto: CreateMovieDto,
    poster: Express.Multer.File,
    userId: string,
  ) {
    const movie = await this.prisma.movie.create({
      data: {
        title: dto.title,
        slug: dto.slug,
        description: dto.description,
        releaseYear: dto.release_year,
        durationMinutes: dto.duration_minutes,
        subscriptionType: dto.subscription_type,
        posterUrl: poster.filename,
        rating: new Prisma.Decimal(0),
        createdById: userId,
        categories: {
          create: dto.category_ids.map((id) => ({
            category: { connect: { id } },
          })),
        },
      },
    });

    return {
      success: true,
      message: "Yangi kino muvaffaqiyatli qo'shildi",
      data: movie,
    };
  }

  async updateMovie(id: string, dto: UpdateMovieDto) {
    const data: any = { ...dto };

    if (dto.category_ids) {
      data.categories = {
        set: dto.category_ids.map((id) => ({ id })),
      };
      delete data.category_ids;
    }

    const movie = await this.prisma.movie.update({
      where: { id },
      data,
    });

    return {
      success: true,
      message: "Kino ma'lumotlari yangilandi",
      data: movie,
    };
  }

  async deleteMovie(id: string) {
    await this.prisma.movieFile.deleteMany({ where: { movieId: id } });
    await this.prisma.movie.delete({ where: { id } });
    return {
      success: true,
      message: "Kino muvaffaqiyatli o'chirildi",
    };
  }

  async uploadMovieFile(
    id: string,
    file: Express.Multer.File,
    body: { quality: string; language: string },
  ) {
    console.log(id);
    const movie = await this.prisma.movie.findUnique({ where: { id } });

    if (!movie) {
      throw new Error('Bunday idga ega kino topilmadi');
    }
    if (!Object.values(VideoQuality).includes(body.quality as VideoQuality)) {
      throw new Error("Noto'g'ri qualitu");
    }

    const newFile = await this.prisma.movieFile.create({
      data: {
        movieId: id,
        fileUrl: file.path,
        quality: body.quality as VideoQuality,
        language: body.language,
      },
    });

    return {
      success: true,
      message: 'Kino muvaffaqiyatli yuklandi',
      data: newFile,
    };
  }
}
