import { IsString } from 'class-validator';

export class GetTenantsDto {
  @IsString()
  tenant: string;
}
