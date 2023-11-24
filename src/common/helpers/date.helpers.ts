import { LOCALE } from '@common/constants/time.constants';

export const currentDateToDDMMYYYY = () => {
  const currentDate = new Date();
  const dateFormatOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };

  return new Intl.DateTimeFormat(LOCALE, dateFormatOptions)
    .format(currentDate)
    .replace(/\//g, '.');
};
