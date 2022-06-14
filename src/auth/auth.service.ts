import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

export interface AccessToken {
  access_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup({ email, password }: AuthDto): Promise<AccessToken> {
    try {
      const hash = await argon.hash(password);
      const user = await this.prisma.user.create({ data: { email, hash } });
      return this.signToken(user);
    } catch (error) {
      if (!(error instanceof PrismaClientKnownRequestError)) throw error;
      if (error.code !== 'P2002') throw error;
      throw new ForbiddenException('Email already in use');
    }
  }

  async signin({ email, password }: AuthDto): Promise<AccessToken> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new ForbiddenException('Invalid credentials');

    const isCorrectPassword = await argon.verify(user.hash, password);
    if (!isCorrectPassword) throw new ForbiddenException('Invalid credentials');

    return this.signToken(user);
  }

  async signToken({ id: sub, email }: User): Promise<AccessToken> {
    const payload = { sub, email };
    const secret = this.config.get('JWT_SECRET');

    const access_token = await this.jwt.signAsync(payload, { expiresIn: '90m', secret });

    return { access_token };
  }
}
