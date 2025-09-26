import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerService } from './mail.service';


@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true })],
    providers: [MailerService],
    exports: [MailerService],
})
export class MailerModule { }
