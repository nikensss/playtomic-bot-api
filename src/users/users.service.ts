import { Injectable } from '@nestjs/common';
import { PreferredClub, PreferredTime, User } from '@prisma/client';
import { DbService } from 'src/db/db.service';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class UsersService {
  constructor(private db: DbService, private logger: LoggerService) {
    this.logger.setContext(this);
  }

  async getPreferredTimes(user: User): Promise<PreferredTime['time'][]> {
    const preferredTimes = await this.db.preferredTime.findMany({
      where: { user },
      select: { time: true },
      orderBy: { time: 'asc' },
    });

    return preferredTimes.map(e => e.time);
  }

  async addPreferredTime(user: User, time: string): Promise<PreferredTime> {
    const preferredTime = await this.db.preferredTime.findUnique({
      where: { userId_time: { userId: user.id, time } },
    });

    if (preferredTime) return preferredTime;

    return await this.db.preferredTime.create({ data: { userId: user.id, time } });
  }

  async deletePreferredTime(user: User, time: string): Promise<PreferredTime | undefined> {
    try {
      return await this.db.preferredTime.delete({
        where: { userId_time: { userId: user.id, time } },
      });
    } catch (ex) {
      if ('code' in ex && ex.code === 'P2025') return undefined;
      throw ex;
    }
  }

  async getPreferredClubs(user: User): Promise<PreferredClub['clubId'][]> {
    const preferredClubs = await this.db.preferredClub.findMany({
      where: { userId: user.id },
      select: { clubId: true },
    });

    return preferredClubs.map(e => e.clubId);
  }

  async addPreferredClub(user: User, clubId: string): Promise<PreferredClub> {
    const preferredClub = await this.db.preferredClub.findUnique({
      where: { userId_clubId: { userId: user.id, clubId } },
    });

    if (preferredClub) return preferredClub;

    return await this.db.preferredClub.create({ data: { userId: user.id, clubId } });
  }

  async deletePreferredClub(user: User, clubId: string): Promise<PreferredClub | undefined> {
    try {
      return await this.db.preferredClub.delete({
        where: { userId_clubId: { userId: user.id, clubId } },
      });
    } catch (ex) {
      if ('code' in ex && ex.code === 'P2025') return undefined;
      throw ex;
    }
  }
}
