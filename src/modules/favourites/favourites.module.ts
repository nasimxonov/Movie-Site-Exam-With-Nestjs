import { Module } from '@nestjs/common';
import { FavoriteController } from './favourites.controller';
import { FavoriteService } from './favourites.service';
import { PrismaService } from 'src/common/core/database/prisma.service';

@Module({
  controllers: [FavoriteController],
  providers: [FavoriteService, PrismaService],
})
export class FavoriteModule {}
