import { IsArray, ArrayMinSize, IsInt, Min } from 'class-validator';

export class CreateGameDto {
    @IsArray()
    @ArrayMinSize(2)
    @IsInt({ each: true })
    @Min(1, { each: true })
    playerIds: number[];
}
