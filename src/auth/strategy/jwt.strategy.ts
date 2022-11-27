import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DbService } from 'src/db/db.service';
import { LoggerService } from 'src/logger/logger.service';
import { isTelegramJwt } from '../type-guards';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService, private db: DbService, private logger: LoggerService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });

    this.logger.setContext(this);
  }

  async validate(payload: unknown): Promise<User> {
    try {
      if (!isTelegramJwt(payload)) throw new Error('Not a Telegram JWT!');

      const user = {
        telegramId: `${payload.id}`,
        firstName: payload.first_name,
        lastName: payload.last_name,
        userName: payload.username,
      };

      return await this.db.user.upsert({
        where: { telegramId: user.telegramId },
        update: user,
        create: user,
      });
    } catch (ex) {
      this.logger.error({ err: ex });
      throw new UnauthorizedException();
    }
  }
}
