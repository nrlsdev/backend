export class Constants {
  /* COMMON */
  // HTTP Headers
  public static readonly HTTP_HEADER_CONTENT_LANGUAGE: string =
    'content-language';

  // Language
  public static readonly DEFAULT_LANGUAGE_CODE: string = 'en-US';

  /* SYSTEM */
  // Systemuser
  public static readonly PASSWORD_BCRYPT_SALT_LENGTH: number = 10;

  // Cookies
  public static readonly JSON_WEB_TOKEN_COOKIE_NAME: string = 'token';

  public static readonly REFRESH_TOKEN_COOKIE_NAME: string = 'refreshToken';
}