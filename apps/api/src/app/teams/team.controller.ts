import { Body, Controller, Delete, Post, UseGuards, Request, Get, Param } from "@nestjs/common";
import { TeamService } from "./team.service";
import { CreateTeamDto } from "./teams.dto";
import { Team } from "./team.entity";
import { JwtAuthGuard } from "../auth/auth.guard";


@Controller('teams')
export class TeamController {
    constructor(
        private readonly teamService: TeamService) { }

    @UseGuards(JwtAuthGuard)
    @Post('createTeam')
    async create(@Request() req, @Body() dto: CreateTeamDto): Promise<Team> {
        return this.teamService.createTeam(dto,
            req.user.id,
        );
    }
    @Post('addToTeam')
    async addToTeam(@Body() body: { caller_id: number, project_id: number; email: string; team_id: number; role: string }) {
        return this.teamService.addUserToTeam(body.caller_id, body.email, body.team_id, body.role, body.project_id);
    }

    @Delete('removeFromTeam')
    async removeFromTeam(
        @Body() body: { project_id: number; team_id: number; user_id: number }
    ) {
        return this.teamService.deleteUserFromTeam(
            body.project_id,
            body.team_id,
            body.user_id,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Get('byProject/:projectId')
    async getTeamsByProject(@Param('projectId') projectId: number) {
        return this.teamService.getTeamsByProject(projectId);
    }

}