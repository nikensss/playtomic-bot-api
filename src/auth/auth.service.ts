import { Injectable } from '@nestjs/common';

export interface AccessToken {
  access_token: string;
}

@Injectable()
export class AuthService {}
