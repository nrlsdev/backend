import { Middleware, Context } from '@nuxt/types';
import { SystemUserAuthenticationModule } from '@/store/modules/system-user-authentication';

const redirectToSignInPageIfNotSignedIn: Middleware = (context: Context) => {
  const vuexToken = SystemUserAuthenticationModule.token;

  if (!vuexToken) {
    context.redirect('/account/signin');
    return;
  }

  // ToDo: Verify token
  console.log('ToDo: verify token');
};

export default redirectToSignInPageIfNotSignedIn;
