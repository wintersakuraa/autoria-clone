export const getSkip = (page: number = 1, limit: number = 10) =>
  (page - 1) * limit;
