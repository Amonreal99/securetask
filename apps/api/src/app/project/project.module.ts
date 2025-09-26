import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { MailerModule } from '../mail/mail.module';
import { User } from '../users/user.entity';
import { ProjectMember } from '../project-member/project-member.entity';


@Module({
    imports: [TypeOrmModule.forFeature([Project, User, ProjectMember]), MailerModule],
    providers: [ProjectService],
    controllers: [ProjectController],
    exports: [ProjectService],
})
export class ProjectModule { }