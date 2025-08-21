import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/core/database/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findMe(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(dto: any) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) throw new Error('Email already in use');

    const existingUsername = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });
    if (existingUsername) throw new Error('Username already in use');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.create({
      data: {
        email: dto.email,
        username: dto.username,
        passwordHash: hashedPassword,
        role: dto.role,
      },
    });
  }

  async update(id: string, dto: any) {
    if (dto.password) {
      dto.passwordHash = await bcrypt.hash(dto.password, 10);
      delete dto.password;
    }
    return this.prisma.user.update({
      where: { id },
      data: dto,
    });
  }
  async remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
