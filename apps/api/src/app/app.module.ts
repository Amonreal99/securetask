import { Module } from '@nestjs/common';

import { Team } from './teams/team.entity';
import { Task } from './tasks/task.entity';
import { TeamMember } from './team-member/team-member.entity';

import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskService } from './tasks/task.service';
import { TaskController } from '../app/tasks/task.controller';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { User } from './users/user.entity';
import { ProjectMember } from './project-member/project-member.entity';
import { Project } from './project/project.entity';
import { ProjectModule } from './project/project.module';
import { TeamModule } from './teams/team.module';
import { TaskModule } from './tasks/task.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Task, Team, TeamMember, ProjectMember, Project],
      synchronize: true,
    }),
    AuthModule, UserModule, ProjectModule, TeamModule, TaskModule],


})
export class AppModule { }
