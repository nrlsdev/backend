import { Mailer } from '@backend/server';
import { SystemConfiguration } from '@backend/systemconfiguration';

const { host, port, email, user, password } = SystemConfiguration.mail.noreply;

export const noreplyMailer: Mailer = new Mailer(email, {
  host,
  port,
  auth: {
    user,
    pass: password,
  },
});
