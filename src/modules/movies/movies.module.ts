import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { AuthModule } from '../auth/auth.module';
import { MoviesService } from './movies.service';
import { PrismaService } from 'src/common/core/database/prisma.service';

@Module({
      imports: [AuthModule],
      controllers: [MoviesController],
      providers: [MoviesService, PrismaService],
})
export class MoviesModule {}
