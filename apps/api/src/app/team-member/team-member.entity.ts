
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    OneToMany,
    ManyToOne
} from 'typeorm';
import { Team } from '../teams/team.entity';
import { User } from '../users/user.entity';


@Entity('team_members')
export class TeamMember {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Team, (team) => team.members)
    @JoinColumn({ name: 'team_id' })
    team: Team;

    @ManyToOne(() => User, (user) => user.teamMemberships)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ default: 'viewer' })
    role: string;

}