import { Module } from '@nestjs/common';
import { ProjectMember } from './project-member.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectMemberService } from './project-member.service';
import { ProjectMemberController } from './project-member.controller';

@Module({
    imports: [TypeOrmModule.forFeature([ProjectMember])],
    providers: [ProjectMemberService],
    controllers: [ProjectMemberController],
    exports: [TypeOrmModule, ProjectMemberService],

}) export class ProjectMemberModule { }