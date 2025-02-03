import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestUser } from '../interfaces/request-user.interface';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): RequestUser | null => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user?: RequestUser }>();

    return request.user ?? null;
  },
);
