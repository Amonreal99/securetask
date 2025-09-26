import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    OneToMany,
    ManyToOne
} from 'typeorm';
import { User } from '../users/user.entity';
import { Team } from '../teams/team.entity';
import { Project } from '../project/project.entity';

@Entity('tasks')
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'created_by' })
    created_by: User;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ default: '' })
    title: string;

    @Column()
    subject: string;

    @ManyToOne(() => Team, { nullable: true })
    @JoinColumn({ name: 'team_id' })
    team: Team;

    @Column()
    body: string;

    @Column({ type: 'text', array: true, nullable: true })
    attachments: string[];

    @Column({ default: 'viewer' })
    visibility: string;

    @ManyToOne(() => Project, { nullable: false })
    @JoinColumn({ name: 'project_id' })
    project: Project;

}