import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { ProjectMember } from '../project-member/project-member.entity';
import { User } from "../users/user.entity";
import { Team } from "../teams/team.entity";
import { Task } from "../tasks/task.entity";

export enum ProjectRole {
    OWNER = 'owner',
    ADMIN = 'admin',
    VIEWER = 'viewer'
}

@Entity('project')
export class Project {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 25 })
    project_name: string;

    @Column({ default: 0 })
    num_teams: number;

    @Column({ default: 0 })
    num_members: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column()
    owner_id: number;

    @Column({ type: 'enum', enum: ProjectRole, default: ProjectRole.OWNER })
    role: string;

    @OneToMany(() => ProjectMember, (pm) => pm.project)
    members: ProjectMember[];

    @OneToMany(() => Team, (team) => team.project)
    teams: Team[];

    @OneToMany(() => Task, task => task.project)
    tasks: Task[];


}