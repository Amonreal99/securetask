import { Controller, Get, Post, Body, Request, UseGuards, Query } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { JwtAuthGuard } from '../auth/auth.guard';
import { useContainer } from 'class-validator';

@Controller('tasks')
export class TaskController {
    constructor(private readonly appService: TaskService) { }

    @UseGuards(JwtAuthGuard)
    @Post('createTask')
    async create(@Request() req, @Body() body: { title: string; subject: string; body: string; project_id: number; team_id: number, attachements?: string[], visibility?: string; }): Promise<Task> {
        return this.appService.createTask(

            body.title,
            body.subject,
            body.body,
            req.user.id,
            body.project_id,
            body.team_id,
            body.attachements,
            body.visibility ?? 'viewer',
        );
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(@Request() req, @Query('project_id') projectId: number): Promise<Task[]> {
        return this.appService.getAllTask(req.user.id, Number(projectId));
    }
}
