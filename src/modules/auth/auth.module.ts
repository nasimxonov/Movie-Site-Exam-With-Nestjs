import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/common/core/database/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from 'src/common/guard/auth.guard';
import { JwtStrategy } from './jwt.strategy';

@Global()
@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_KEY'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtAuthGuard,JwtStrategy],
  exports: [AuthService, JwtModule], 
})
export class AuthModule {}
