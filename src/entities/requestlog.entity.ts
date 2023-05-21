export type RequestLog = {
  id: string;
  timeStamp: Date;
  userLoggedToken: string;
  userHost: string;
  method: string;
  url: string;
  statusCode: number;
  responseLength: number;
  responseTimeMs: number;
};
