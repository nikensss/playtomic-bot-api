import { IsString } from 'class-validator';

export class GetClubsDto {
  @IsString()
  name: string;
}
