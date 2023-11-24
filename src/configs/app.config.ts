export const appConfig = {
  port: process.env.PORT || 3000,
  validationPipeOptions: {
    whitelist: true,
    transform: true,
    forbidUnknownValues: false,
  },
};
