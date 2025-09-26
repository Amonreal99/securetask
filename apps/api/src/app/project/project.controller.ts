
import { Body, Controller, Post, Delete, UseGuards, Request, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from '../project/project.dto';
import { Project } from './project.entity';
import { ProjectMember } from '../project-member/project-member.entity';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('projects')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) { }

    @UseGuards(JwtAuthGuard)
    @Post('create')
    async create(@Request() req, @Body() dto: CreateProjectDto): Promise<Project> {
        return this.projectService.createProject(dto, req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) projectId: number, @Request() req) {
        return this.projectService.deleteProject(projectId, req.user.id)
    }

    @UseGuards(JwtAuthGuard)
    @Get('myProject')
    async getMyProjects(@Request() req) {
        return this.projectService.getProject(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('invite')
    async invite(
        @Request() req, @Body() body: { email: string; project_id: number; username: string; project_name: string },
    ): Promise<{ message: string }> {
        return this.projectService.inviteToProject(
            body.email,
            body.project_id,
            body.username,
            body.project_name,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Post('addUser')
    async addUser(
        @Request() req, @Body() body: { caller_id: number; email: string; project_id: number; role?: string },
    ): Promise<ProjectMember> {
        return this.projectService.addUserToProject(
            req.user.id,
            body.email,
            body.project_id,
            body.role,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Post('removeUser')
    async removeUser(
        @Request() req, @Body() body: { email: string; project_id: number },
    ): Promise<{ message: string }> {
        return this.projectService.deleteUserFromProject(
            req.user.id,
            body.email,
            body.project_id,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Post('changeRole')
    async changingRole(@Request() req, @Body() body: { project_id: number; role: string; email: string }): Promise<ProjectMember> {
        return this.projectService.changeRole(
            req.user.id,
            body.project_id,
            body.role,
            body.email
        )
    }


}
