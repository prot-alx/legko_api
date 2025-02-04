import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { appConfig } from 'src/config/configuration';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request): string | null => {
          const cookies: Record<string, unknown> = req.cookies;
          const token = cookies?.['jwt'];
          return typeof token === 'string' ? token : null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: appConfig.JWT_SECRET ?? 'empty__jwt__secret__key',
    });
  }

  validate(payload: JwtPayload): {
    id: string;
    email: string;
    role: string;
  } {
    return {
      id: String(payload.sub),
      email: String(payload.email),
      role: String(payload.role),
    };
  }
}
