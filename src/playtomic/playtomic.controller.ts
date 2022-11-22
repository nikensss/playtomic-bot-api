import { Controller, Get, Query } from '@nestjs/common';
import { GetTenantsDto } from './dto';
import { PlaytomicService } from './playtomic.service';

@Controller('playtomic')
export class PlaytomicController {
  constructor(private playtomicService: PlaytomicService) {}

  @Get('tenants')
  async getTenants(@Query() { tenant }: GetTenantsDto): Promise<unknown> {
    return await this.playtomicService.getTenants(tenant);
  }
}
