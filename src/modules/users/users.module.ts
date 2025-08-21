import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/common/core/database/prisma.service';
import { UsersService } from './users.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ConfigModule, AuthModule],
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  exports: [UsersService],
})
export class UsersModule {}
