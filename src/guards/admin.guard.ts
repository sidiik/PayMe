import { CanActivate, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';
import { Observable } from 'rxjs';

interface CustomeReq extends Request {
  user?: User;
}

export class AdminGuard implements CanActivate {
  constructor(private readonly allowedRoles: string[]) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { user }: Request = context.switchToHttp().getRequest();
    if (this.allowedRoles.includes(user.role)) {
      return true;
    }

    return false;
  }
}
