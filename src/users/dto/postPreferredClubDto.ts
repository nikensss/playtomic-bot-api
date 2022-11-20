import { IsString } from 'class-validator';

export class PostPreferredClubDto {
  @IsString()
  clubId: string;
}
