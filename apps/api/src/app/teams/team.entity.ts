
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    OneToMany,
    ManyToOne
} from 'typeorm';
import { User } from '../users/user.entity';
import { TeamMember } from '../team-member/team-member.entity';
import { Project } from '../project/project.entity';





@Entity('teams')
export class Team {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @ManyToOne(() => User, (user) => user.teams, { nullable: false })
    @JoinColumn({ name: 'created_by' })
    created_by: User;

    @OneToMany(() => TeamMember, (tm) => tm.team)
    members: TeamMember[];

    @ManyToOne(() => Project, (project) => project.teams, { nullable: false })
    @JoinColumn({ name: 'project_id' }) // 👈 add FK to projects table
    project: Project;

}