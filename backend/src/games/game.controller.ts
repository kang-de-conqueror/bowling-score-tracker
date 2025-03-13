import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';

@Controller('games')
export class GameController {
    constructor(private readonly gameService: GameService) {}

    @Post()
    async create(@Body() createGameDto: CreateGameDto) {
        return this.gameService.create(createGameDto);
    }

    @Get()
    async findAll() {
        return this.gameService.findAll();
    }

    @Get(':gameId')
    async findGameById(@Param('gameId') gameId: number) {
        return this.gameService.findGameById(gameId);
    }

    @Get(':gameId/scoreboard')
    async getGameScoreboard(@Param('gameId') gameId: number) {
        return this.gameService.getGameScoreboard(gameId);
    }
}
