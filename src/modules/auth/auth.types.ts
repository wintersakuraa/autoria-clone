import { AccountType, Role } from '@models/user/user.enums';

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  sub: string;
  role: Role;
  accountType: AccountType;
}
