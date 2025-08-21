import { PaymentMethod } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsString, ValidateNested } from 'class-validator';

export class PaymentDetailsDto {
  @IsString()
  card_number: string;

  @IsString()
  expiry: string;

  @IsString()
  card_holder: string;
}

export class PurchaseSubscriptionDto {
  @IsString()
  plan_id: string;

  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;

  @IsBoolean()
  auto_renew: boolean;

  @ValidateNested()
  @Type(() => PaymentDetailsDto)
  payment_details: PaymentDetailsDto;
}
