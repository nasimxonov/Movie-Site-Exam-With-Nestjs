import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_KEY');
    if (!jwtSecret) {
      throw new UnauthorizedException('JWT secret not defined');
    }
    super({
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => req?.cookies?.token, 
    ExtractJwt.fromAuthHeaderAsBearerToken(),
  ]),
  secretOrKey: jwtSecret,
});

  }

  async validate(payload: any) {
    return { id: payload.userId, email: payload.email, role: payload.role };
  }
}
