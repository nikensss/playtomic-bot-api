import { IsString } from 'class-validator';

export class DeletePreferredClubDto {
  @IsString()
  clubId: string;
}
