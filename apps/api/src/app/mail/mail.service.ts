import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    async sendVerificationEmail(to: string, code: string) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject: 'Verify your SecureTask account',
            text: `Your verification code is: ${code}`,
        };

        return this.transporter.sendMail(mailOptions);
    }
    async sendInvitationEmail(to: string, project_name: string) {
        return this.transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject: ` Invitation to join project ${project_name} `,
            text: `You have been invited to join the project ${project_name}. Log in to your SecureTask account to view the project.`
        })
    }

    async sendPasswordResetEmail(to: string, code: string) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject: 'SecureTask Password Reset',
            text: `You requested a password reset. Use this code to reset your password: ${code}`,
        };

        return this.transporter.sendMail(mailOptions);
    }




}
