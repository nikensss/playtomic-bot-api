import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { User as DbUser } from '@prisma/client';
import { User } from 'src/auth/decorators/user.decorator';
import { JwtGuard } from 'src/auth/guards';
import { GetTenantsDto } from './dto';
import { PlaytomicService } from './playtomic.service';

@Controller('playtomic')
export class PlaytomicController {
  constructor(private playtomicService: PlaytomicService) {}

  @Get('tenants')
  async getTenants(@Query() { tenant }: GetTenantsDto): Promise<unknown> {
    return await this.playtomicService.findTenants(tenant);
  }

  @UseGuards(JwtGuard)
  @Get('availability')
  async getAvailability(@User() user: DbUser): Promise<unknown> {
    return await this.playtomicService.getAllTenantsAvailabilityForUser(user);
  }
}
