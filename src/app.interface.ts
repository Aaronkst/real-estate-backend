export interface IResponse {
  status: string;
  timestamp?: number;
}

export interface ISuccessResponse extends IResponse {
  total?: number;
  data: any;
}

export interface IHello {
  data: string;
}
