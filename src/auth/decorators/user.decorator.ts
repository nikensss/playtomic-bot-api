import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { User as DbUser } from '@prisma/client';

export const User = createParamDecorator((_: unknown, context: ExecutionContext): DbUser => {
  const request = context.switchToHttp().getRequest();
  if (!request?.user) throw new UnauthorizedException();

  return request.user;
});
