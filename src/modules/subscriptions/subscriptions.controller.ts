import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { SubscriptionService } from './subscriptions.service';
import { PurchaseSubscriptionDto } from './dto/subscriptions.dto';
import { JwtAuthGuard } from 'src/common/guard/auth.guard';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('all-plans')
  async getAllPlans() {
    return this.subscriptionService.getAllPlans();
  }

  @Get('plans')
  async getPlans() {
    return this.subscriptionService.getPlans();
  }

  @UseGuards(JwtAuthGuard)
  @Post('purchase')
  async purchase(@Body() dto: PurchaseSubscriptionDto, @Req() req) {
    const userId = req.user?.id;
    return this.subscriptionService.purchase(dto, userId);
  }
}
