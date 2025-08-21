import {
  Controller,
  Post,
  Body,
  Res,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    try {
      const user = await this.authService.register(dto);
      return {
        success: true,
        message: "Muvaffaqiyatli ro'yxatdan o'tdiz'",
        data: user,
      };
    } catch (error) {
      throw new InternalServerErrorException('Serverda xatolik yuz berdi');
    }
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res() res: any) {
    try {
      const { token, user } = await this.authService.login(dto);

      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'strict',
      });

      return res.send({
        success: true,
        message: 'Muvaffaqiyatli kirildi',
        data: {
          user_id: user.id,
          username: user.username,
          role: user.role,
          subscription: {
            plan_name: 'Free',
            expires_at: null,
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Serverda xatolik yuz berdi');
    }
  }

  @Post('logout')
  logout(@Res() res: any) {
    res.clearCookie('token');
    return res.send({
      success: true,
      message: 'Muvaffaqiyatli tizimdan chiqildi',
    });
  }
}
