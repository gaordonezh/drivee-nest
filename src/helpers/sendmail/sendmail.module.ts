import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { SendMailService } from './sendmail.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // upgrade later with STARTTLS
        auth: {
          user: 'drivee.services@gmail.com',
          pass: 'hjyf cetg qsgu abia', // hjyf cetg qsgu abia
        },
      },
      defaults: {
        from: '"Drivee" <drivee.services@gmail.com>',
      },
    }),
  ],
  controllers: [],
  providers: [SendMailService],
  exports: [SendMailService],
})
export class SendMailModule {}
