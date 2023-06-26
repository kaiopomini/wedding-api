import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RolesGuard {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  canActivate(context: ExecutionContext) {
    return this.hasRolePermission(context);
  }

  private async hasRolePermission(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const id = request.user['sub'];

    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      return false;
    }

    return roles.indexOf(user.role) > -1;
  }
}
