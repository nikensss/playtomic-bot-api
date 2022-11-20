import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DbService } from 'src/db/db.service';
import { LoggerService } from 'src/logger/logger.service';
import { z } from 'zod';

const jwtPayloadValidator = z.object({
  id: z.number(),
  is_bot: z.boolean(),
  first_name: z.string(),
  last_name: z.string(),
  username: z.string(),
  language_code: z.string(),
});

type JwtPayload = z.infer<typeof jwtPayloadValidator>;

const validatePayload = (payload: unknown): JwtPayload => jwtPayloadValidator.parse(payload);

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService, private db: DbService, private logger: LoggerService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
    this.logger.setContext(this);
  }

  async validate(_payload: unknown): Promise<User> {
    try {
      const payload = validatePayload(_payload);

      const user = await this.db.user.findUnique({
        where: { telegramId: `${payload.id}` },
      });

      if (user) return user;

      return await this.db.user.create({
        data: {
          telegramId: `${payload.id}`,
          firstName: payload.first_name,
          lastName: payload.last_name,
          userName: payload.username,
        },
      });
    } catch (ex) {
      this.logger.error({ err: ex });
      throw new UnauthorizedException();
    }
  }
}
