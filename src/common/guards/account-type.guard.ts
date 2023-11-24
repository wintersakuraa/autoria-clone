import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';

import { AccountType } from '@models/user/user.enums';

export const AccountTypeGuard = (
  accountType: AccountType,
): Type<CanActivate> => {
  class AccountTypeGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest();
      const user = request.user;

      return user && accountType === user.accountType;
    }
  }

  return mixin(AccountTypeGuardMixin);
};
