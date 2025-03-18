export interface ListMetaData {
  totalCount: number;
  totalPage?: number;
}

export interface IResponseData<T = any> {
  data?: T;
  message?: string;
  statusCode?: number;
  error?: boolean;
  metadata?: ListMetaData;
  isFile?: boolean;
}
