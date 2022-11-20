import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { User as DbUser } from '@prisma/client';
import { User } from 'src/auth/decorators/user.decorator';
import { JwtGuard } from 'src/auth/guards';
import { DeletePreferredClubDto, DeletePreferredTimeDto, PostPreferredClubDto } from './dto';
import { PostPreferredTimeDto } from './dto/postPreferredTimeDto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get('preferred-time')
  async getPreferredTimes(
    @User() user: DbUser,
  ): Promise<ReturnType<UsersService['getPreferredTimes']>> {
    return await this.usersService.getPreferredTimes(user);
  }

  @UseGuards(JwtGuard)
  @Post('preferred-time')
  async addPreferredTime(
    @User() user: DbUser,
    @Body() { time }: PostPreferredTimeDto,
  ): Promise<ReturnType<UsersService['addPreferredTime']>> {
    return await this.usersService.addPreferredTime(user, time);
  }

  @UseGuards(JwtGuard)
  @Delete('preferred-time')
  async deletePreferredTime(
    @User() user: DbUser,
    @Body() { time }: DeletePreferredTimeDto,
  ): Promise<ReturnType<UsersService['deletePreferredTime']>> {
    return await this.usersService.deletePreferredTime(user, time);
  }

  @UseGuards(JwtGuard)
  @Get('preferred-club')
  async getPreferredClubs(
    @User() user: DbUser,
  ): Promise<ReturnType<UsersService['getPreferredClubs']>> {
    return await this.usersService.getPreferredClubs(user);
  }

  @UseGuards(JwtGuard)
  @Post('preferred-club')
  async addPreferredClub(
    @User() user: DbUser,
    @Body() { clubId }: PostPreferredClubDto,
  ): Promise<ReturnType<UsersService['addPreferredClub']>> {
    return await this.usersService.addPreferredClub(user, clubId);
  }

  @UseGuards(JwtGuard)
  @Delete('preferred-club')
  async deletePreferredClub(
    @User() user: DbUser,
    @Body() { clubId }: DeletePreferredClubDto,
  ): Promise<ReturnType<UsersService['deletePreferredClub']>> {
    return await this.usersService.deletePreferredClub(user, clubId);
  }
}
