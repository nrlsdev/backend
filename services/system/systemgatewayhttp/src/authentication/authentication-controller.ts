import { Request, Response } from '@backend/server';

export function onUserSignUp(request: Request, response: Response) {
  const { email, firstname, lastname, password } = request.body;

  if (!email || !firstname || !lastname || !password) {
    response.statusCode = 422;
    response.statusMessage = 'Unprocessable Entity';

    response
      .send({
        error: '422 Unprocessable Entity',
      })
      .end();
    return;
  }

  response.statusCode = 200;
  response.statusMessage = 'OK';
  response.send({}).end();
}

export function onUserSignIn(request: Request, response: Response) {
  const { email, password } = request.body;

  if (!email || !password) {
    response.statusCode = 422;
    response.statusMessage = 'Unprocessable Entity';

    response
      .send({
        error: '422 Unprocessable Entity',
      })
      .end();
    return;
  }

  response.statusCode = 200;
  response.statusMessage = 'OK';
  response.send({}).end();
}

export function onValidateToken(request: Request, response: Response) {
  const { jwt } = request.query;

  if (!jwt) {
    response.statusCode = 422;
    response.statusMessage = 'Unprocessable Entity';

    response
      .send({
        error: '422 Unprocessable Entity',
      })
      .end();
    return;
  }

  response.statusCode = 200;
  response.statusMessage = 'OK';
  response.send({}).end();
}
