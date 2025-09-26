import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { User } from '../users/user.entity';
import { Team } from '../teams/team.entity';
import { ProjectMember } from '../project-member/project-member.entity';
import { TeamMember } from '../team-member/team-member.entity';
import { Project } from '../project/project.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Task, User, Team, TeamMember, ProjectMember, Project])],
    providers: [TaskService],
    controllers: [TaskController],
    exports: [TaskService]
}) export class TaskModule { }