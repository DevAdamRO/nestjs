// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  // ✅ nombre explícito
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET!,
    });

    // ✅ Este console.log te dirá si Nest está registrando la estrategia
    console.log('[JwtStrategy] constructor ejecutado ✅');
  }

  validate(payload: { sub: number; email: string; role: string }) {
    console.log('JWT payload recibido:', payload); // ✅ ahora debe aparecer
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
