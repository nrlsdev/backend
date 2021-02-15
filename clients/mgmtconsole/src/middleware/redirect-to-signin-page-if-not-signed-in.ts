import { Middleware, Context } from '@nuxt/types';
import { isUserAuthenticated } from '@/api/system-user/system-user-authentication';

const redirectToSignInPageIfNotSignedIn: Middleware = async (
  context: Context,
) => {
  const isAuthenticated: boolean = await isUserAuthenticated();

  if (isAuthenticated) {
    return;
  }

  const redirectPath: string = context.route.path;

  context.redirect(`/account/signin?redirect=${redirectPath}`);
};

export default redirectToSignInPageIfNotSignedIn;
