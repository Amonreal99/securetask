import { Controller } from "@nestjs/common";
import { ProjectMemberService } from "./project-member.service";



@Controller('project-member')
export class ProjectMemberController {
    constructor(
        private readonly projectMemberService: ProjectMemberService) { }

}