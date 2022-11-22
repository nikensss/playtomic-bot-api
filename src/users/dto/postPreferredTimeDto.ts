import { IsString, Matches } from 'class-validator';

export class PostPreferredTimeDto {
  @IsString()
  @Matches(/^([01][0-9]|[2][0-3]):[0-9]{2}:[0-9]{2}$/)
  time: string;
}
