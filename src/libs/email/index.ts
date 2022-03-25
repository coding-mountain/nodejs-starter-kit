import nodemailer, { Transporter } from 'nodemailer';
import path from 'path';
import { readFileSync } from 'fs';
import {
  APP_ENV,
  EMAIL_FROM_EMAIL,
  EMAIL_FROM_NAME,
  EMAIL_HOST,
  EMAIL_PASSWORD,
  EMAIL_PORT,
  EMAIL_USERNAME,
} from '@app/config';
import * as Eta from 'eta';

class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD,
      },
    });
  }

  private sendEmail(to: string, subject: string, html: string, bcc: string[] = []) {
    const mailOptions = {
      from: `${EMAIL_FROM_NAME} <${EMAIL_FROM_EMAIL}>`,
      to,
      bcc,
      subject,
      html,
    };

    if (APP_ENV === 'test') {
      return true;
    }

    return this.transporter.sendMail(mailOptions);
  }

  /**
   * [async send email with verify token to verify email]
   *
   * @param   {string}  to     [to user email]
   * @param   {string}  name   [name user name]
   * @param   {string}  token  [token verify token]
   *
   * @return  {[type]}         [return description]
   */
  public async sendVerificationEmail(to: string, name: string, token: string) {
    const placeholders = {
      name,
      token,
    };
    const emailContent = await EmailService.getTemplate('emailVerification', placeholders);
    return this.sendEmail(to, 'Email Verification', String(emailContent));
  }

  public async sendForgotPassword(to: string, name: string, token: string) {
    const emailContent = await EmailService.getTemplate('forgetPassword', {
      name,
      token,
    });
    return this.sendEmail(to, 'Password Reset', String(emailContent));
  }

  static getTemplate(templateName: string, data: { [key: string]: any }) {
    const templatePath = path.resolve(__dirname, '../../templates', `${templateName}.html`);
    const template = readFileSync(templatePath, 'utf-8');
    const content = Eta.render(template, data);
    return content;
  }
}

export default new EmailService();
