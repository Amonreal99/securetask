import { IsInt, IsString, MinLength } from "class-validator";

export class CreateTeamDto {
    @IsString()
    @MinLength(3)
    name: string;



    @IsInt()
    project_id: number;

}