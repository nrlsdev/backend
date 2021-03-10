import { Middleware, Context } from '@nuxt/types';
import { isUserAuthenticated } from '@/api/system-user/system-user-authentication';

const redirectToIndexPageIfSignedIn: Middleware = async (context: Context) => {
  const isAuthenticated: boolean = await isUserAuthenticated();

  if (!isAuthenticated) {
    return;
  }

  context.redirect('/');
};

export default redirectToIndexPageIfSignedIn;
