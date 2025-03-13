import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, DataSource } from 'typeorm';
import { Game } from './game.entity';
import { Player } from '../players/player.entity';
import { Frame } from '../frames/frame.entity';
import { CreateGameDto } from './dto/create-game.dto';

@Injectable()
export class GameService {
    constructor(
        @InjectRepository(Game) private gameRepo: Repository<Game>,
        @InjectRepository(Frame) private frameRepo: Repository<Frame>,
        @InjectRepository(Player) private playerRepo: Repository<Player>,
        private readonly dataSource: DataSource,
    ) { }

    async create(createGameDto: CreateGameDto) {
        return await this.dataSource.transaction(async (manager) => {
            const newGame = manager.create(Game, { isActive: true });
            const savedGame = await manager.save(newGame);

            const players = await manager.find(Player, {
                where: { id: In(createGameDto.playerIds) },
                relations: ['games'],
            });

            if (players.length !== createGameDto.playerIds.length) {
                throw new NotFoundException('One or more players not found');
            }

            players.forEach((player) => {
                player.games.push(savedGame);
            });
            await manager.save(players);

            const frames: Frame[] = [];
            for (const player of players) {
                for (let i = 1; i <= 10; i++) {
                    frames.push(
                        manager.create(Frame, {
                            frameNumber: i,
                            firstRoll: null,
                            secondRoll: null,
                            bonusRoll: null,
                            game: savedGame,
                            player: player,
                        }),
                    );
                }
            }
            await manager.save(frames);

            return { gameId: savedGame.id, players };
        });
    }

    async findGameById(gameId: number): Promise<Game> {
        const game = await this.gameRepo.findOne({
            where: { id: gameId },
            relations: ['players'],
        });

        if (!game) {
            throw new NotFoundException(`Game with ID ${gameId} not found`);
        }
        return game;
    }

    async findAll(): Promise<Game[]> {
        return this.gameRepo.find({ relations: ['players'] });
    }


    async getGameScoreboard(gameId: number) {
        const game = await this.gameRepo.findOne({
            where: { id: gameId },
            relations: ['players'],
        });

        if (!game) {
            throw new NotFoundException(`Game with ID ${gameId} not found`);
        }

        const players = await this.playerRepo.find({
            where: { id: In(game.players.map((p) => p.id)) },
        });

        const frames = await this.frameRepo.find({
            where: { game: { id: gameId } },
            relations: ['player', 'game'],
            order: { frameNumber: 'ASC' },
        });

        return players.map((player) => {
            const playerFrames = frames
                .filter((frame) => frame.player.id === player.id)
                .sort((a, b) => a.frameNumber - b.frameNumber);

            return {
                player: player.name,
                frames: playerFrames.map((frame) => ({
                    frameNumber: frame.frameNumber,
                    scoreInput: this.formatScore(frame.firstRoll, frame.secondRoll, frame.bonusRoll),
                })),
                totalScore: this.calculateTotalScore(playerFrames),
            };
        });
    }

    private formatScore(
        firstRoll: string | null,
        secondRoll: string | null,
        bonusRoll: string | null,
    ): string {
        if (!firstRoll) return '-';
        if (firstRoll === 'X') {
            return secondRoll || bonusRoll
                ? `X ${secondRoll ?? ''} ${bonusRoll ?? ''}`.trim()
                : 'X';
        }
        if (secondRoll === '/') {
            return `${firstRoll} /${bonusRoll ? ` ${bonusRoll}` : ''}`;
        }
        if (secondRoll) {
            return bonusRoll
                ? `${firstRoll} ${secondRoll} ${bonusRoll}`
                : `${firstRoll} ${secondRoll}`;
        }
        return firstRoll;
    }

    private calculateTotalScore(frames: Frame[]): number {
        let total = 0;

        for (let i = 0; i < frames.length; i++) {
            const frame = frames[i];
            const frameNumber = frame.frameNumber;

            if (!frame.firstRoll) {
                continue;
            }

            let frameScore = 0;

            if (frame.firstRoll === 'X' && frameNumber < 10) {
                frameScore += 10;

                const nextFrame = frames[i + 1];
                if (nextFrame) {
                    frameScore += this.getRollValue(nextFrame.firstRoll);

                    if (nextFrame.firstRoll === 'X' && nextFrame.frameNumber < 10) {
                        const nextNextFrame = frames[i + 2];
                        if (nextNextFrame) {
                            frameScore += this.getRollValue(nextNextFrame.firstRoll);
                        }
                    } else {
                        frameScore += this.getRollValue(nextFrame.secondRoll);
                    }
                }
            } else if (frame.firstRoll === 'X' && frameNumber === 10) {
                frameScore += 10;
                if (frame.secondRoll) {
                    frameScore += this.getRollValue(frame.secondRoll);
                }
                if (frame.bonusRoll) {
                    frameScore += this.getRollValue(frame.bonusRoll);
                }
            } else {
                frameScore += this.getRollValue(frame.firstRoll);

                if (frame.secondRoll) {
                    if (frame.secondRoll === '/') {
                        frameScore = 10;
                        if (frameNumber < 10) {
                            const nextFrame = frames[i + 1];
                            if (nextFrame) {
                                frameScore += this.getRollValue(nextFrame.firstRoll);
                            }
                        } else {
                            if (frame.bonusRoll) {
                                frameScore += this.getRollValue(frame.bonusRoll);
                            }
                        }
                    } else {
                        frameScore += this.getRollValue(frame.secondRoll);

                        if (frameNumber === 10 && frame.bonusRoll) {
                            frameScore += this.getRollValue(frame.bonusRoll);
                        }
                    }
                }
            }

            total += frameScore;
        }

        return total;
    }

    private getRollValue(roll: string | null): number {
        if (!roll) return 0;
        if (roll === 'X') return 10;
        if (roll === '/') return 0;
        const parsed = parseInt(roll, 10);
        return isNaN(parsed) ? 0 : parsed;
    }
}
