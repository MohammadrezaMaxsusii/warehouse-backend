import { IConfig } from "./config.interface";

export const defaults: IConfig = {
  app: {
    name: "APP-NAME",
    port: 3000,
    superAdmin: { username: "super_admin", password: "meetingAppPassword" },
  },
  db: { uri: "mongodb://localhost:27017", dbName: "meeting" },
  minio: {
    host: "localhost",
    port: 9000,
    username: "minioadmin",
    password: "minioadmin",
    bucketName: "defaultbucket",
    useSSL: false,
  },
  jwt: {
    secret: "simple-secret",
    accessTtl: "1d",
    refreshTtl: "7d",
  },
  cron: {
    checkExamLastExecution: "0 */5 * * * *",
    lockUsersInExam: "0 */5 * * * *",
  },
};
