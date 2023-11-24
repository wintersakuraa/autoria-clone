import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';

import { Role } from '@models/user/user.enums';

export const RoleGuard = (roles: Role[]): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest();
      const user = request.user;

      return user && roles.some((role) => user.role === role);
    }
  }

  return mixin(RoleGuardMixin);
};
