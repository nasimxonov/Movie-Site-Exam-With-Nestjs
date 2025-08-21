import { Global, Module } from '@nestjs/common';
import { SubscriptionService } from './subscriptions.service';
import { SubscriptionController } from './subscriptions.controller';
import { PrismaService } from 'src/common/core/database/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Global()
@Module({
  imports: [AuthModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, PrismaService],
})
export class SubscriptionModule {}
