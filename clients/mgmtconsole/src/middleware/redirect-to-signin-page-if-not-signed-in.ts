import { Middleware, Context } from '@nuxt/types';
import { SystemUserAuthenticationModule } from '@/store/modules/system-user-authentication';

const redirectToSignInPageIfNotSignedIn: Middleware = async (
  context: Context,
) => {
  const isTokenValid: boolean = await SystemUserAuthenticationModule.validateAndRefreshToken(
    context,
  );

  if (isTokenValid) {
    return;
  }

  context.redirect('/account/signin');
};

export default redirectToSignInPageIfNotSignedIn;
