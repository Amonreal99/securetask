import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Team } from "./team.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../users/user.entity";
import { TeamMember } from "../team-member/team-member.entity";
import { CreateTeamDto } from "./teams.dto";
import { Project } from "../project/project.entity";
import { ProjectMember } from "../project-member/project-member.entity";



@Injectable()
export class TeamService {
    constructor(
        @InjectRepository(Team)
        private teamRepository: Repository<Team>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(TeamMember)
        private teamMemberRepository: Repository<TeamMember>,
        @InjectRepository(Project)
        private projectRepository: Repository<Project>,
        @InjectRepository(ProjectMember)
        private projectMemberRepository: Repository<ProjectMember>
    ) { }

    async createTeam(dto: CreateTeamDto, userId: number): Promise<Team> {

        const project = await this.projectRepository.findOne({
            where: { id: dto.project_id },
            relations: ['members'],
        });
        if (!project) throw new NotFoundException('Project not found');

        const existingTeams = await this.teamRepository.count({ where: { project: { id: dto.project_id } } });
        if (existingTeams >= project.num_teams) {
            throw new BadRequestException('Maximum number of teams reached for this project');
        }


        const membership = await this.projectMemberRepository.findOne({
            where: { project: { id: dto.project_id }, user: { id: userId } },
        });
        if (!membership || !['owner', 'admin'].includes(membership.role)) {
            throw new ForbiddenException('Only project owner or admins can create teams');
        }


        const team = this.teamRepository.create({
            name: dto.name,
            created_by: { id: userId } as User,
            project,
        });

        return this.teamRepository.save(team);
    }

    /* async addUserToTeam(caller_id: number, user_id: number, team_id: number, role: string, project_id: number) {

        const caller = await this.projectMemberRepository.findOne({
            where: { project: { id: project_id }, user: { id: user_id } }
        })
        if (!caller || ['owner', 'admin'].includes(caller.role)) {
            throw new ForbiddenException("Only owners and admin can make placements into teams")
        }

        const projectMembership = await this.projectMemberRepository.findOne({
            where: { project: { id: project_id }, user: { id: user_id } }
        });
        if (!projectMembership) throw new NotFoundException("User not a member of the Project");

        const team = await this.teamRepository.findOne({
            where: { id: team_id }
        })
        if (!team) throw new NotFoundException("Team does not exist");



        const existing = await this.teamMemberRepository.findOne({
            where: { team: { id: team_id }, user: { id: caller_id } }
        })
        if (existing) throw new Error("user arleady a member of the team");

        const user = await this.userRepository.findOne({ where: { id: user_id } });
        if (!user) throw new NotFoundException('User not found');

        const member = this.teamMemberRepository.create({
            team,
            user,
            role

        })
        return this.teamMemberRepository.save(member);
    } */

    async addUserToTeam(
        caller_id: number,
        email: string,
        team_id: number,
        role: string,
        project_id: number
    ) {
        // 1. Ensure caller is owner/admin in the project
        const caller = await this.projectMemberRepository.findOne({
            where: { project: { id: project_id }, user: { id: caller_id } }
        });

        if (!caller || !['owner', 'admin'].includes(caller.role)) {
            throw new ForbiddenException("Only owners and admins can add users to teams");
        }

        // 2. Look up the target user by email
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) throw new NotFoundException("User not found");

        // 3. Ensure the target user is already a member of the project
        const projectMembership = await this.projectMemberRepository.findOne({
            where: { project: { id: project_id }, user: { id: user.id } }
        });

        if (!projectMembership) {
            throw new NotFoundException("User is not a member of this project");
        }

        // 4. Ensure the team exists
        const team = await this.teamRepository.findOne({
            where: { id: team_id }
        });
        if (!team) throw new NotFoundException("Team does not exist");

        // 5. Prevent duplicate team membership
        const existing = await this.teamMemberRepository.findOne({
            where: { team: { id: team_id }, user: { id: user.id } }
        });
        if (existing) throw new Error("User is already a member of this team");

        // 6. Create and save team membership
        const member = this.teamMemberRepository.create({
            team,
            user,
            role
        });

        return this.teamMemberRepository.save(member);
    }


    async deleteUserFromTeam(
        project_id: number,
        team_id: number,
        user_id: number
    ) {

        const team = await this.teamRepository.findOne({
            where: { id: team_id },
            relations: ['project'],
        });
        if (!team) throw new NotFoundException('Team not found');
        if (team.project.id !== project_id) {
            throw new ForbiddenException('This team does not belong to the given project');
        }

        const teamMember = await this.teamMemberRepository.findOne({
            where: { team: { id: team_id }, user: { id: user_id } },
            relations: ['user', 'team'],
        });
        if (!teamMember) {
            throw new NotFoundException('User is not a member of this team');
        }
        await this.teamMemberRepository.delete(teamMember.id);

        return {
            message: `User ${teamMember.user.username} removed from team ${team.name}`,
            team: { id: team.id, name: team.name },
            user: { id: teamMember.user.id, email: teamMember.user.email },
        };
    }


    async getTeamsByProject(projectId: number) {
        const teams = await this.teamRepository.find({
            where: { project: { id: projectId } },
            relations: ['created_by'],
        });
        return teams;
    }


}