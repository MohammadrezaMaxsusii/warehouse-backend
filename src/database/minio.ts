import * as Minio from "minio";
import { configurations } from "../config/configurations";

class MinioClass {
  client: Minio.Client;
  private configs = configurations.minio;

  constructor() {
    this.client = new Minio.Client({
      endPoint: this.configs.host,
      port: this.configs.port,
      accessKey: this.configs.username,
      secretKey: this.configs.password,
      useSSL: this.configs.useSSL,
    });

    this.initialize();
  }

  private async initialize() {
    await this.ensureBucket();
  }

  private async ensureBucket() {
    const bucketResult = await this.client.bucketExists(
      this.configs.bucketName.toLowerCase()
    );

    if (!bucketResult) {
      await this.client.makeBucket(this.configs.bucketName.toLowerCase());
    }

    console.log(
      `📁\tMinio connected using bucket "${this.configs.bucketName}"`
    );
  }
}

const minioInstance = new MinioClass();
export default minioInstance.client;
