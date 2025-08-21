import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FavoriteService } from './favourites.service';

@Controller('favorites')
@UseGuards(AuthGuard('jwt'))
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Get()
  async getFavorites(@Req() req) {
    const userId = req.user.id;
    const data = await this.favoriteService.getFavorites(userId);
    return {
      success: true,
      data,
    };
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async addFavorite(@Req() req, @Body() body: { movie_id: string }) {
    const userId = req.user.id;
    const favorite = await this.favoriteService.addFavorite(
      userId,
      body.movie_id,
    );
    return {
      success: true,
      message: "Kino sevimlilar ro'yxatiga qo'shildi",
      data: favorite,
    };
  }
  @Delete(':movie_id')
  async removeFavorite(@Req() req, @Param('movie_id') movieId: string) {
    const userId = req.user.id;
    await this.favoriteService.removeFavorite(userId, movieId);
    return {
      success: true,
      message: "Kino sevimlilar ro'yxatidan o'chirildi",
    };
  }
}
