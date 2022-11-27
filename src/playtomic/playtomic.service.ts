import dayjs from 'dayjs';
import { User } from '.prisma/client';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { UsersService } from 'src/users/users.service';
import { Tenant, TenantJson } from './tenant';
import { Availability, AvailabilityJson } from './availability';

@Injectable()
export class PlaytomicService {
  private readonly PLAYTOMIC_API = 'https://playtomic.io/api';

  constructor(private http: HttpService, private usersService: UsersService) {}

  async getClubs(name: string): Promise<TenantJson[]> {
    const { data } = await firstValueFrom(
      this.http.get<TenantJson[]>(`${this.PLAYTOMIC_API}/v1/tenants`, {
        params: { tenant_name: name, size: 10, playtomic_status: 'ACTIVE' },
      }),
    );

    return data;
  }

  async getClub(clubId: string): Promise<TenantJson> {
    const response = this.http.get(`${this.PLAYTOMIC_API}/v1/tenants/${clubId}`);
    return (await firstValueFrom(response)).data;
  }

  async getAllClubsAvailabilityForUser(user: User): Promise<unknown> {
    const preferredClubs = await this.usersService.getPreferredClubs(user);
    return await Promise.all(preferredClubs.map(t => this.getClubAvailabilityForUser(user, t)));
  }

  async getClubAvailabilityForUser(user: User, clubId: string): Promise<unknown> {
    const tenant = new Tenant(await this.getClub(clubId));
    tenant.setAvailability(await this.getFullClubAvailability(clubId));

    return tenant.toJson(...(await this.usersService.getPreferredTimes(user)));
  }

  async getFullClubAvailability(clubId: string): Promise<Availability[]> {
    const availability: Promise<Availability[]>[] = new Array(15)
      .fill(0)
      .map((_, i) => this.getClubAvailability(clubId, dayjs().add(i, 'days')));

    return (await Promise.all(availability)).flat();
  }

  async getClubAvailability(clubId: string, day: dayjs.Dayjs): Promise<Availability[]> {
    const { data } = await firstValueFrom(
      this.http.get<AvailabilityJson[]>(`${this.PLAYTOMIC_API}/v1/availability`, {
        timeout: 15000,
        params: {
          tenant_id: clubId,
          user_id: 'me',
          sport_id: 'PADEL',
          local_start_min: day.startOf('day').format('YYYY-MM-DDTHH:mm:ss'),
          local_start_max: day.endOf('day').format('YYYY-MM-DDTHH:mm:ss'),
        },
      }),
    );

    return data.map(e => new Availability(e));
  }
}
