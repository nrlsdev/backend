import { Request, Response, StatusCodes } from '@backend/server';

export async function onValidateToken(_request: Request, response: Response) {
  response
    .status(StatusCodes.OK)
    .send({
      meta: {
        statusCode: StatusCodes.OK,
      },
      body: {},
    })
    .end();
}
