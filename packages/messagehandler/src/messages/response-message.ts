export interface ResponseMessage {
  meta: {
    statusCode: number;
  };
  body: {
    data?: {};
    error?: string;
  };
}
