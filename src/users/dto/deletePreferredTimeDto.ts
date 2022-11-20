import { IsString } from 'class-validator';

export class DeletePreferredTimeDto {
  @IsString()
  time: string;
}
