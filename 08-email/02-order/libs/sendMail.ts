import juice from 'juice';
import config from '../config';
import path from 'path';
import pug from 'pug';

import nodemailer from 'nodemailer';
import nodemailerHtmlToText from 'nodemailer-html-to-text';
import SMTPTransport from 'nodemailer-smtp-transport';
import StubTransport from 'nodemailer-stub-transport';
import Mail, { Address } from 'nodemailer/lib/mailer';

export interface IMailOptions {
  template: string;
  locals: Record<string, any>;
  to: string;
  subject: string;
}

interface IMessage extends Mail.Options {
  html: string;
  to: Address;
  subject: string;
}

const htmlToText = nodemailerHtmlToText.htmlToText;

const transportEngine =
  process.env.NODE_ENV === 'test'
    ? new StubTransport()
    : new SMTPTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: config.mailer.user,
          pass: config.mailer.password,
        },
      });

const transport = nodemailer.createTransport(transportEngine);

transport.use('compile', htmlToText());

/*
 * sendMail - функция, отправляющая письмо на указанный адрес
 * options - объект, содержащий опции для отправки писем:
 * options.template - имя файла, содержащего шаблон письма
 * options.locals - объект с переменными, которые будут переданы в шаблон
 * options.to - email, на который будет отправлено письмо
 * options.subject - тема письма
 * пример:
 *     await sendMail({
 *       template: 'confirmation',
 *       locals: {token: 'token'},
 *       to: 'user@mail.com',
 *       subject: 'Подтвердите почту',
 *     });
 * */
export const sendMail = async function sendMail(options: IMailOptions) {
  const html = pug.renderFile(
    path.join(__dirname, '../templates', options.template) + '.pug',
    options.locals || {}
  );

  const message: IMessage = {
    html: juice(html),
    to: {
      name: options.to,
      address: options.to,
    },
    subject: options.subject,
  };

  return await transport.sendMail(message);
};

export default transportEngine;
