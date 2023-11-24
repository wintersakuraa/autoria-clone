import Filter from 'bad-words';

import { Role } from '@models/user/user.enums';

export const isSupervisor = (role: Role) =>
  role === Role.ADMIN || role === Role.MANAGER;

export const isValidText = (text: string) => {
  const filter = new Filter();
  return !filter.isProfane(text);
};
