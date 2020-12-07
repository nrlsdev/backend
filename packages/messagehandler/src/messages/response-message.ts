export interface ResponseMessage {
  meta: {
    statusCode: number;
    statusMessage: string;
  };
  body: {
    data?: {};
    error?: string;
  };
}
