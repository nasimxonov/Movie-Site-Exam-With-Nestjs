import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/common/core/database/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async register(dto: { username: string; email: string; password: string }) {
    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        passwordHash: hash,
      },
    });

    return {
      success: true,
      message: "Ro'yxatdan muvaffaqiyatli o'tdingiz",
      data: {
        user_id: user.id,
        username: user.username,
        role: user.role,
        created_at: user.createdAt,
      },
    };
  }

  async login(dto: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new UnauthorizedException('Email yoki parol xato');
    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Email yoki parol xato');
    const token = await this.jwtService.signAsync(
      { userId: user.id, role: user.role, email: user.email },
      { expiresIn: '7d' },
    );

    return { token, user };
  }
}
