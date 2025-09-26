import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProjectMember } from "./project-member.entity";
import { Repository } from "typeorm";


@Injectable()
export class ProjectMemberService {
    constructor(
        @InjectRepository(ProjectMember)
        private projectMemberRepository: Repository<ProjectMember>,
    ) { }
}