import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { User as DbUser } from '@prisma/client';
import { User } from 'src/auth/decorators/user.decorator';
import { JwtGuard } from 'src/auth/guards';
import { GetClubsDto } from './dto';
import { PlaytomicService } from './playtomic.service';
import { TenantJson } from './tenant';

@Controller('playtomic')
export class PlaytomicController {
  constructor(private playtomicService: PlaytomicService) {}

  @Get('clubs')
  async getClubs(@Query() { name }: GetClubsDto): Promise<TenantJson[]> {
    return await this.playtomicService.getClubs(name);
  }

  @Get('clubs/:id')
  async getClub(@Param('id') id: string): Promise<TenantJson> {
    return await this.playtomicService.getClub(id);
  }

  @UseGuards(JwtGuard)
  @Get('availability')
  async getAvailability(@User() user: DbUser): Promise<unknown> {
    return await this.playtomicService.getAllClubsAvailabilityForUser(user);
  }
}
