import { AccountType, Role } from '@models/user/user.enums';

export interface RequestUser {
  id: string;
  role: Role;
  accountType: AccountType;
  refreshToken?: string;
}

export interface Response<T> {
  data: T;
}

export type PaginationResponse<T> = Response<T> & {
  total: number;
};

export type ResponseMetaWrapper<T, K> = T & {
  meta: K;
};

export interface ExceptionResponse {
  statusCode: number;
  message: any;
  error: string;
}
