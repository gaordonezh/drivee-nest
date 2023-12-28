import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateUserEmailTemplateDto } from './mail.dto';
import templates from './sendmain.template';

@Injectable()
export class SendMailService {
  constructor(private readonly mailerService: MailerService) {}

  sendEmailWithTemplate(params: CreateUserEmailTemplateDto): void {
    this.mailerService.sendMail({
      to: params.email,
      subject: params.subject,
      html: templates[params.template](params.fields),
    });
  }
}
