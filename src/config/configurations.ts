import dotenv from "dotenv";
import { IConfig } from "./config.interface";
import { defaults } from "./defaults";

dotenv.config();

export const configurations: IConfig = {
  app: {
    name: process.env.APP_NAME || defaults.app.name,
    port: Number(process.env.APP_PORT) || defaults.app.port,
    superAdmin: {
      username:
        process.env.SUPER_ADMIN_USERNAME || defaults.app.superAdmin.username,
      password:
        process.env.SUPER_ADMIN_PASSWORD || defaults.app.superAdmin.password,
    },
  },
  db: {
    uri: process.env.DB_URI || defaults.db.uri,
    dbName: process.env.DB_NAME || defaults.db.dbName,
  },
  minio: {
    host: process.env.MINIO_HOST || defaults.minio.host,
    port: Number(process.env.MINIO_PORT) || defaults.minio.port,
    username: process.env.MINIO_USERNAME || defaults.minio.username,
    password: process.env.MINIO_PASSWORD || defaults.minio.password,
    bucketName: process.env.MINIO_BUCKET || defaults.minio.bucketName,
    useSSL: defaults.minio.useSSL,
  },
  jwt: {
    secret: process.env.JWT_SECRET || defaults.jwt.secret,
    accessTtl: process.env.JWT_ACCESSTTL || defaults.jwt.accessTtl,
    refreshTtl: process.env.JWT_REFRESHTTL || defaults.jwt.refreshTtl,
  },
  cron: {
    checkExamLastExecution:
      process.env.CRON_CHECK_EXAM_LAST_EXECUTION ||
      defaults.cron.checkExamLastExecution,
    lockUsersInExam:
      process.env.CRON_LOCK_USERS_IN_EXAM || defaults.cron.lockUsersInExam,
  },
};
