export enum ENV {
  DEV = 'development',
  PROD = 'production',
  TEST = 'test',
}

export const APP_PORT: string = process.env.APP_PORT || '3000';
export const APP_ENV = (process.env.NODE_ENV || process.env.APP_ENV) as ENV;

export const DB_HOST = process.env.DB_HOST as string;
export const DB_NAME = process.env.DB_NAME as string;
export const DB_USERNAME = process.env.DB_USERNAME as string;
export const DB_PASSWORD = process.env.DB_PASSWORD as string;

export const EMAIL_HOST = process.env.EMAIL_HOST as string;
export const EMAIL_PORT = Number(process.env.EMAIL_PORT);
export const EMAIL_USERNAME = process.env.EMAIL_USERNAME as string;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD as string;
export const EMAIL_FROM_EMAIL = process.env.EMAIL_FROM_EMAIL as string;
export const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME as string;

export const SENTRY_DNS = process.env.SENTRY_DNS as string;

export const TOKEN_EXPIRE_TIME: number = 15 * 60 * 1000;

export const JWT_SECRET: string = process.env.JWT_SECRET_KEY || 'secret';
export const JWT_VERSION: number = 1.0;
export const JWT_EXPIRES_IN: string = APP_ENV === ENV.PROD ? '3h' : '1h';
export const REFRESH_TOKEN_SECRET_KEY: string = `refresh-${JWT_SECRET}` || 'refresh_secret';
export const REFRESH_TOKEN_VERSION: number = 1.0;
export const REFRESH_TOKEN_EXPIRES_IN: string = APP_ENV === ENV.PROD ? '30d' : '5d';

const requiredEnvVars: any = {
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_NAME,
};
if (APP_ENV !== ENV.TEST) {
  for (const value in requiredEnvVars) {
    if (!requiredEnvVars[value]) {
      // eslint-disable-next-line no-console
      console.error(`${value} is required`);
      process.exit();
    }
  }
}
