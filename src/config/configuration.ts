import { config } from 'dotenv';

config();

export const appConfig = {
  PORT: parseInt(process.env.PORT ?? '3000', 10),
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRATION: process.env.JWT_EXPIRATION,
  FRONTEND_URL: process.env.FRONTEND_URL,
};
