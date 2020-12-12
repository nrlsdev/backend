import { Request, Response, NextFunction } from 'express';
import { language } from '../../../src/middleware/language';

let mockRequest: Partial<Request>;
let mockResponse: Partial<Response>;
const nextFunction: NextFunction = jest.fn();

beforeEach(() => {
  mockRequest = {};
  mockResponse = {
    json: jest.fn(),
  };
});

describe('language()', () => {
  it('language middleware should extract the current language code from the passed content-language header and put it into the response body.', () => {
    const expectedMockResponse = {
      headers: { 'content-language': 'en-US' },
      body: { languageCode: 'en-US' },
    };

    mockRequest = {
      headers: {
        'content-language': 'en-US',
      },
      body: {},
    };

    language(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toBeCalledTimes(1);
    expect(expectedMockResponse).toMatchObject(expectedMockResponse);
  });

  it('language middleware should be called, but should nothing put into the response body, because no headers exist.', () => {
    const expectedMockResponse = { body: {} };

    mockRequest = {
      body: {},
    };

    language(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toBeCalledTimes(1);
    expect(expectedMockResponse).toMatchObject(expectedMockResponse);
  });

  it('language middleware should be called, but should nothing put into the response body, because no language code was passed in the header.', () => {
    const expectedMockResponse = { body: {} };

    mockRequest = {
      headers: {},
      body: {},
    };

    language(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toBeCalledTimes(1);
    expect(expectedMockResponse).toMatchObject(expectedMockResponse);
  });
});
