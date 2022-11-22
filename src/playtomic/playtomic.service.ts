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

  async findTenants(tenant: string): Promise<unknown> {
    const { data } = await firstValueFrom(
      this.http.get(`${this.PLAYTOMIC_API}/v1/tenants`, {
        params: { tenant_name: tenant, size: 10, playtomic_status: 'ACTIVE' },
      }),
    );

    return data;
  }

  async getTenant(tenant_id: string): Promise<TenantJson> {
    const response = this.http.get(`${this.PLAYTOMIC_API}/v1/tenants/${tenant_id}`);
    return (await firstValueFrom(response)).data;
  }

  async getAllTenantsAvailabilityForUser(user: User): Promise<unknown> {
    const preferredTenants = await this.usersService.getPreferredClubs(user);
    return await Promise.all(preferredTenants.map(t => this.getTenantAvailabilityForUser(user, t)));
  }

  async getTenantAvailabilityForUser(user: User, tenant_id: string): Promise<unknown> {
    const tenant = new Tenant(await this.getTenant(tenant_id));
    tenant.setAvailability(await this.getFullTenantAvailability(tenant_id));

    return tenant.summary(...(await this.usersService.getPreferredTimes(user)));
  }

  async getFullTenantAvailability(tenant_id: string): Promise<Availability[]> {
    const availability: Promise<Availability[]>[] = new Array(15)
      .fill(0)
      .map((_, i) => this.getTenantAvailability(tenant_id, dayjs().add(i, 'days')));

    return (await Promise.all(availability)).flat();
  }

  async getTenantAvailability(tenant_id: string, day: dayjs.Dayjs): Promise<Availability[]> {
    const { data } = await firstValueFrom(
      this.http.get<AvailabilityJson[]>(`${this.PLAYTOMIC_API}/v1/availability`, {
        params: {
          tenant_id,
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
