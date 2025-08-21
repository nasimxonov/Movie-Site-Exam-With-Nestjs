import {
  Global,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Global()
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  async onModuleInit() {
    try {
      this.$connect();
      this.logger.log('Database connected!!');
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async onModuleDestroy() {
    this.$disconnect();
  }
}
