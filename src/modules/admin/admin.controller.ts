import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { JwtAuthGuard } from 'src/common/guard/auth.guard';

function storageOptions(folder: string) {
  return {
    storage: diskStorage({
      destination: `./uploads/${folder}`,
      filename: (req, file, cb) => {
        const uniqueName = uuidv4();
        const ext = extname(file.originalname);
        cb(null, uniqueName + ext);
      },
    }),
  };
}

@Controller('admin/movies')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  findAll() {
    return this.adminService.getAllMovies();
  }
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('poster', storageOptions('posters')))
  create(
    @Body() dto: CreateMovieDto,
    @UploadedFile() poster: Express.Multer.File,
    @Req() req,
  ) {
    console.log(req.user);
    

    const userId = req.user.id;
    return this.adminService.createMovie(dto, poster, userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMovieDto) {
    return this.adminService.updateMovie(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.deleteMovie(id);
  }

  @Post(':id/files')
  @UseInterceptors(FileInterceptor('file', storageOptions('movies')))
  uploadFile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body,
  ) {
    return this.adminService.uploadMovieFile(id, file, body);
  }
}
