import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    OneToMany,
    ManyToOne,
    BeforeInsert,
    BeforeUpdate
} from 'typeorm';
import { Team } from '../teams/team.entity';
import { TeamMember } from '../team-member/team-member.entity';
import { ProjectMember } from '../project-member/project-member.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password_hash: string;

    @Column({ default: 'viewer' })
    role: string;

    @OneToMany(() => Team, (team) => team.created_by)
    teams: Team[];

    @OneToMany(() => TeamMember, (tm) => tm.user)
    teamMemberships: TeamMember[];

    @Column({ nullable: true })
    verificationCode: string;

    @Column({ default: false })
    isVerified: boolean;

    @OneToMany(() => ProjectMember, (pm) => pm.user)
    projectMemberships: ProjectMember[];


    @BeforeInsert()
    @BeforeUpdate()
    emailToLowerCase() {
        this.email = this.email.toLowerCase();
        this.username = this.username.toLowerCase();
    }


}