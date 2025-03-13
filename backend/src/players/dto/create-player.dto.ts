import { IsString, Length } from 'class-validator';

export class CreatePlayerDto {
    @IsString()
    @Length(1, 50)
    name: string;
}
