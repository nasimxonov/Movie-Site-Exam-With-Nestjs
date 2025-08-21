import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/core/database/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { ReviewController } from './review.controller';

@Module({
  imports: [AuthModule],
  controllers: [ReviewController],
  providers: [PrismaService],
})
export class ReviewsModule {}
