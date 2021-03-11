import { Mailer } from '@backend/server';
import { ApplicationConfiguration } from '@backend/applicationconfiguration';

const {
  host,
  port,
  email,
  user,
  password,
} = ApplicationConfiguration.mail.noreply;

export const noreplyMailer: Mailer = new Mailer(email, {
  host,
  port,
  auth: {
    user,
    pass: password,
  },
});
