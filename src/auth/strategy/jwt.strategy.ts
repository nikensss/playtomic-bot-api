import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate({ sub: id }: { sub: string; email: string }): Promise<Omit<User, 'hash'>> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, createdAt: true, updatedAt: true, nonce: true },
    });
    if (!user) throw new ForbiddenException();

    return user;
  }
}
