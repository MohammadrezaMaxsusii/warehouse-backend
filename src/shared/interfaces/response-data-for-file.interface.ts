import { Readable } from "stream";
import { IResponseData } from "./response-data.interface";

export interface IResponseDataForFiles extends IResponseData {
  readableStream?: Readable;
}
