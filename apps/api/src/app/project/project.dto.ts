
import { IsInt, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class CreateProjectDto {
    @IsString()
    @MinLength(3)
    project_name: string;

    @IsInt()
    num_teams: number;


}
