import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateFrameDto {
    @IsInt()
    @Min(1)
    gameId: number;

    @IsInt()
    @Min(1)
    playerId: number;

    @IsOptional()
    @IsString()
    firstRoll?: string;

    @IsOptional()
    @IsString()
    secondRoll?: string;

    @IsOptional()
    @IsString()
    bonusRoll?: string;
}
