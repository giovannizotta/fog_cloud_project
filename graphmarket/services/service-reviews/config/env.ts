import { bool, cleanEnv, port, str, url } from 'envalid';
import { EnvUtil } from '@libs/utils';

EnvUtil.loadEnvFile();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    default: 'production',
    devDefault: 'development',
    choices: ['production', 'development', 'test'],
  }),
  PORT: port({ default: 80, devDefault: 8082 }),
  DEBUG: bool({ default: false, devDefault: true }),
  GRAPHQL_PATH: str({ default: '/graphql' }),
  DATABASE_URL: url(),
  DATABASE_SSL: bool({ default: true, devDefault: false }),
  DATABASE_SYNCHRONIZE: bool({ default: false, devDefault: true }),
});
