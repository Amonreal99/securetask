import { Injectable } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt';
import { Users } from '../users/user.interface';

@Injectable()
export class AuthService {
    constructor(private jwtservice: JwtService) { }

    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return bcrypt.hash(password, salt);
    }

    async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);

    }
    async generateToken(user: Users): Promise<string> {
        const payload = {
            sub: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        };
        return this.jwtservice.signAsync(payload);

    }

}