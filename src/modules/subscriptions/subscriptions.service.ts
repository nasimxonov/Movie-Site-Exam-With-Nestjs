import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/core/database/prisma.service';
import { PurchaseSubscriptionDto } from './dto/subscriptions.dto';

@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService) {}

  async getAllPlans() {
    return await this.prisma.subscriptionPlan.findMany();
  }

  async getPlans() {
    const plans = await this.prisma.subscriptionPlan.findMany({
      where: { isActive: true },
    });
    return { success: true, data: plans };
  }

  async purchase(dto: PurchaseSubscriptionDto, userId: string) {
    if (!dto.plan_id)
      throw new BadRequestException('Plan id bosh bolishi mumkin emas');

    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { id: dto.plan_id },
    });

    if (!plan || !plan.isActive)
      throw new BadRequestException("Noto'g'ri subscription plan");

    const subscription = await this.prisma.userSubscription.create({
      data: {
        userId,
        planId: plan.id,
        startDate: new Date(),
        endDate: new Date(
          new Date().setDate(new Date().getDate() + plan.durationDays),
        ),
        status: 'active',
        autoRenew: dto.auto_renew,
      },
    });

    const paymentDetailsJson: Prisma.InputJsonValue = {
      card_number: dto.payment_details.card_number,
      expiry: dto.payment_details.expiry,
      card_holder: dto.payment_details.card_holder,
    };

    const payment = await this.prisma.payment.create({
      data: {
        userSubscriptionId: subscription.id,
        amount: plan.price,
        status: 'completed',
        externalTransactionId: 'txn_' + Date.now(),
        paymentMethod: dto.payment_method,
        paymentDetails: paymentDetailsJson,
      },
    });

    return {
      success: true,
      message: 'Obuna muvaffaqiyatli sotib olindi',
      data: {
        subscription: {
          id: subscription.id,
          plan: {
            id: plan.id,
            name: plan.name,
          },
          start_date: subscription.startDate,
          end_date: subscription.endDate,
          status: subscription.status,
          auto_renew: subscription.autoRenew,
        },
        payment: {
          id: payment.id,
          amount: payment.amount,
          status: payment.status,
          external_transaction_id: payment.externalTransactionId,
          payment_method: payment.paymentMethod,
        },
      },
    };
  }
}
