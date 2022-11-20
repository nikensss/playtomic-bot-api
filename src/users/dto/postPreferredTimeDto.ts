import { IsString } from 'class-validator';

export class PostPreferredTimeDto {
  @IsString()
  time: string;
}
