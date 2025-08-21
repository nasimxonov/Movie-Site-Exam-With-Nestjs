import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MoviesModule } from '../movies/movies.module';

@Module({
  imports: [MoviesModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
