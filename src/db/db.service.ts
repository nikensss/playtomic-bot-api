import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DbService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  async clean(): Promise<void> {
    await Promise.all([this.preferredClub.deleteMany(), this.preferredTime.deleteMany()]);

    await this.user.deleteMany();
  }
}
