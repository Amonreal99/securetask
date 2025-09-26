import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './team.entity';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { User } from '../users/user.entity';
import { Project } from '../project/project.entity';
import { ProjectMember } from '../project-member/project-member.entity';
import { TeamMember } from '../team-member/team-member.entity';


@Module({
    imports: [TypeOrmModule.forFeature([Team, User, Project, ProjectMember, TeamMember])],
    providers: [TeamService],
    controllers: [TeamController],
    exports: [TeamService]
}) export class TeamModule { }