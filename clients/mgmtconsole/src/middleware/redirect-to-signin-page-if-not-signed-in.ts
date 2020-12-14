import { Middleware, Context } from '@nuxt/types';
import { validateAndRefreshToken } from '@/api/system-user-authentication';

const redirectToSignInPageIfNotSignedIn: Middleware = async (
  context: Context,
) => {
  const isTokenValid: boolean = await validateAndRefreshToken(context);

  if (isTokenValid) {
    return;
  }

  context.redirect('/account/signin');
};

export default redirectToSignInPageIfNotSignedIn;
