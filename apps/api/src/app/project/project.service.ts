import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Project } from "./project.entity";
import { Not, Repository } from "typeorm";
import { CreateProjectDto } from "./project.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { MailerService } from '../mail/mail.service';
import { User } from "../users/user.entity";
import { ProjectMember } from "../project-member/project-member.entity";



@Injectable()
export class ProjectService {
    constructor(
        @InjectRepository(Project)
        private projectRepository: Repository<Project>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(ProjectMember)
        private projectMemberRepository: Repository<ProjectMember>,
        private mailerService: MailerService,
    ) { }

    async createProject(projectDto: CreateProjectDto, ownerId: number) {
        const project = this.projectRepository.create(projectDto);
        const savedProject = await this.projectRepository.save(project);


        const owner = await this.userRepository.findOne({ where: { id: ownerId } });
        if (!owner) {
            throw new NotFoundException('Owner not found');

        }
        const ownerMember = this.projectMemberRepository.create({
            project: savedProject,
            user: owner,
            role: 'owner',
        });
        await this.projectMemberRepository.save(ownerMember);

        return savedProject;
    }
    async deleteProject(projectId: number, ownerId: number) {
        const project = await this.projectRepository.findOne({
            where: { id: projectId, owner_id: ownerId },
        })
        if (!project) {
            throw new NotFoundException("Project not found or you arent the owner")
        }
        await this.projectRepository.remove(project);
        return { message: 'Project deleted successfully' }

    }

    async getProject(ownerId: number) {
        const user = await this.userRepository.findOne({ where: { id: ownerId } })
        if (!user) throw new NotFoundException("user not found");

        const membership = await this.projectMemberRepository.find({
            where: { user: { id: ownerId } }
        });
        return membership.map(m => m.project);
    }


    async inviteToProject(email: string, project_id: number, username: string, project_name: string) {
        await this.mailerService.sendInvitationEmail(email, project_name);
        return { message: `Invitation sent to ${email} to join project ${project_name}` };
    }

    async addUserToProject(caller_id: number, email: string, project_id: number, role: string = 'viewer') {
        const project = await this.projectRepository.findOne({ where: { id: project_id } });
        if (!project) throw new NotFoundException('Project not found');

        const callerMembership = await this.projectMemberRepository.findOne({
            where: { project: { id: project_id }, user: { id: caller_id } },
        });
        if (!callerMembership || !['owner', 'admin'].includes(callerMembership.role)) {
            throw new ForbiddenException('Only project owners or admins can add users');
        }

        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) throw new NotFoundException('User not found');

        const existing = await this.projectMemberRepository.findOne({
            where: { project: { id: project_id }, user: { id: user.id } },
        });
        if (existing) {
            throw new Error("User is already a member of this project");
        }

        const member = this.projectMemberRepository.create({
            project,
            user,
            role,
        });
        await this.projectMemberRepository.save(member)

        project.num_members += 1;
        await this.projectRepository.save(project);


        return member;
    }

    async deleteUserFromProject(caller_id: number, email: string, project_id: number) {
        const project = await this.projectRepository.findOne({ where: { id: project_id } });
        if (!project) throw new NotFoundException('Project not found');

        const callerMembership = await this.projectMemberRepository.findOne({
            where: { project: { id: project_id }, user: { id: caller_id } },
        });
        if (!callerMembership || !['owner', 'admin'].includes(callerMembership.role)) {
            throw new ForbiddenException('Only owners and admins can remove users');
        }

        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) throw new NotFoundException('User not found');

        const targetMembership = await this.projectMemberRepository.findOne({
            where: { project: { id: project_id }, user: { id: user.id } },
        });
        if (!targetMembership) {
            throw new NotFoundException('Membership not found');
        }

        if (targetMembership.role === 'owner') {
            throw new ForbiddenException('You cannot remove the project owner');
        }

        if (callerMembership.role === 'admin' && targetMembership.role !== 'viewer') {
            throw new ForbiddenException('Admins can only remove viewers');
        }

        if (callerMembership.role === 'owner' && user.id === caller_id) {
            throw new ForbiddenException('Owners cannot remove themselves');
        }

        await this.projectMemberRepository.remove(targetMembership);

        project.num_members -= 1;
        await this.projectRepository.save(project);

        return { message: `User ${email} removed from project ${project_id}` };
    }



    async changeRole(caller_id: number, project_id: number, role: string, email: string) {

        const project = await this.projectRepository.findOne({ where: { id: project_id } });
        if (!project) throw new NotFoundException('Project Not Found');

        const caller = await this.projectMemberRepository.findOne({
            where: { project: { id: project_id }, user: { id: caller_id } }
        });
        if (!caller || !['owner'].includes(caller.role)) {
            throw new ForbiddenException("only owner can chage roles");
        }
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) throw new NotFoundException('User not found');
        const member = await this.projectMemberRepository.findOne({
            where: { project: { id: project_id }, user: { id: user.id } }
        });
        if (!member) throw new NotFoundException('Project member not found');

        if (member.role === 'owner' && role !== 'owner') {



            const otherOwners = await this.projectMemberRepository.count({
                where: { project: { id: project_id }, role: 'owner' },
            });
            if (otherOwners <= 1) {
                throw new ForbiddenException('Project must always have at least one owner');
            }
        }

        member.role = role;
        return this.projectMemberRepository.save(member);


    }
}