import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Task } from './task.entity';
import { User } from '../users/user.entity';
import { Team } from '../teams/team.entity';
import { ProjectMember } from '../project-member/project-member.entity';
import { TeamMember } from '../team-member/team-member.entity';
import { Project } from '../project/project.entity';

@Injectable()
export class TaskService {


    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Team)
        private teamRepository: Repository<Team>,
        @InjectRepository(Project)
        private projectRepository: Repository<Project>,
        @InjectRepository(ProjectMember)
        private projectMemberRepository: Repository<ProjectMember>,
        @InjectRepository(TeamMember)
        private teamMemberRepository: Repository<TeamMember>
    ) { }
    async createTask(title: string, subject: string, body: string, createdById: number, projectId: number, teamId?: number, attachments?: string[], visibility: string = 'viewer',) {

        const user = await this.userRepository.findOne({ where: { id: createdById } });
        if (!user) throw new NotFoundException('User not found');

        const project = await this.projectRepository.findOne({ where: { id: projectId } });
        if (!project) throw new NotFoundException('Project not found');


        const membership = await this.projectMemberRepository.findOne({
            where: { project: { id: projectId }, user: { id: createdById } },
        });
        if (!membership) throw new ForbiddenException('You are not a member of this project');
        if (!['owner', 'admin'].includes(membership.role)) {
            throw new ForbiddenException('Only owners or admins can create tasks');
        }


        let team = null;
        if (teamId) {
            team = await this.teamRepository.findOne({
                where: { id: teamId },
                relations: ['created_by'],
            });
            if (!team) throw new NotFoundException('Team not found');

        }


        const task = this.taskRepository.create({
            title,
            subject,
            body,
            created_by: user,
            project,
            team,
            attachments,
            visibility,
        });

        return this.taskRepository.save(task);
    }


    async getAllTask(user_id: number, project_id: number) {
        const membership = await this.projectMemberRepository.findOne({ where: { user: { id: user_id }, project: { id: project_id } } })
        if (!membership) throw new NotFoundException("You are not a member of this project");

        if (['owner', 'admin'].includes(membership.role)) {
            return this.taskRepository.find({
                where: { project: { id: project_id } },

            });
        }
        const teamMemberships = await this.teamMemberRepository.find({
            where: { user: { id: user_id }, team: { project: { id: project_id } } },

        });
        const teamIds = teamMemberships.map(tm => tm.team.id);
        if (teamIds.length === 0) return [];
        return this.taskRepository.find({
            where: { team: { id: In(teamIds) }, project: { id: project_id } }
        })
    }



}
