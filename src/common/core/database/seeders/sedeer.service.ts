import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger();

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async seedAll() {
    await this.seedUsers();
  }

  async seedUsers() {
    const username = this.configService.get('SUPERADMIN_USERNAME');
    const email = this.configService.get('SUPERADMIN_EMAIL');
    const password = this.configService.get('SUPERADMIN_PASSWORD');
    const passwordHash = await bcrypt.hash(password, 10);

    const findExistsAdmin = await this.prisma.user.findFirst({
      where: { username },
    });

    if (!findExistsAdmin) {
      await this.prisma.user.create({
        data: {
          username,
          email,
          passwordHash,
          role: 'superadmin',
        },
      });
    }
  }

  async onModuleInit() {
    try {
      await this.seedAll();
    } catch (error) {
      this.logger.error(error);
    }
  }
}
