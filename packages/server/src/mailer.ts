import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { Logger } from '@backend/logger';

const logger: Logger = new Logger('mailer');

export interface MailerTransportOptions {
  host: string;
  port: number;
  auth: {
    user: string;
    pass: string;
  };
}

export class Mailer {
  private mailerTransportOptions: MailerTransportOptions;

  private from: string;

  private mailer: Mail;

  public constructor(
    from: string,
    mailerTransportOptions: MailerTransportOptions,
  ) {
    this.mailerTransportOptions = mailerTransportOptions;
    this.from = from;

    this.mailer = createTransport(this.mailerTransportOptions);
  }

  public async sendMail(sendMailData: {
    to: string;
    subject: string;
    text: string;
    html: string;
  }) {
    this.mailer.sendMail(
      {
        from: this.from,
        to: sendMailData.to,
        subject: sendMailData.subject,
        text: sendMailData.text,
        html: sendMailData.html,
      },
      (error) => {
        if (error) {
          logger.error('sendMail', error.message);
        }
      },
    );
  }
}
