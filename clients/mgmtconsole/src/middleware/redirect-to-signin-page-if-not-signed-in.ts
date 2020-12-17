import { Middleware, Context } from '@nuxt/types';
import { validateAndRefreshToken } from '@/api/system-user-authentication';

const redirectToSignInPageIfNotSignedIn: Middleware = async (
  context: Context,
) => {
  const isTokenValid: boolean = await validateAndRefreshToken(context);

  if (isTokenValid) {
    return;
  }

  const redirectPath: string = context.route.path;

  context.redirect(`/account/signin?redirect=${redirectPath}`);
};

export default redirectToSignInPageIfNotSignedIn;
