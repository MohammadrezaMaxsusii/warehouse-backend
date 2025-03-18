export interface IConfig {
  app: {
    name: string;
    port: number;
    superAdmin: { username: string; password: string };
  };
  db: {
    uri: string;
    dbName: string;
  };
  minio: {
    host: string;
    port: number;
    username: string;
    password: string;
    bucketName: string;
    useSSL: boolean;
  };
  jwt: {
    secret: string;
    accessTtl: string;
    refreshTtl: string;
  };
  cron: {
    checkExamLastExecution: string;
    lockUsersInExam: string;
  };
}
