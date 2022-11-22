import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PlaytomicService {
  private readonly PLAYTOMIC_API = 'https://playtomic.io/api';

  constructor(private http: HttpService) {}

  async getTenants(tenant: string): Promise<unknown> {
    const { data } = await firstValueFrom(
      this.http.get(`${this.PLAYTOMIC_API}/v1/tenants`, {
        params: { tenant_name: tenant, size: 10, playtomic_status: 'ACTIVE' },
      }),
    );

    return data;
  }
}
