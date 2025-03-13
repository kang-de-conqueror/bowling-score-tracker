import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';
import { Repository } from 'typeorm';
import { Game } from './game.entity';
import { Player } from '../players/player.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('GameService', () => {
  let service: GameService;
  let gameRepository: Repository<Game>;
  let playerRepository: Repository<Player>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameService,
        {
          provide: getRepositoryToken(Game),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Player),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<GameService>(GameService);
    gameRepository = module.get<Repository<Game>>(getRepositoryToken(Game));
    playerRepository = module.get<Repository<Player>>(getRepositoryToken(Player));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a game', async () => {
    const player: Player = { id: 1, name: 'Khang Tran', games: [] };
    const game: Game = { id: 1, player, isActive: true, frames: [] };

    jest.spyOn(playerRepository, 'findOne').mockResolvedValue(player);
    jest.spyOn(gameRepository, 'create').mockReturnValue(game as any);
    jest.spyOn(gameRepository, 'save').mockResolvedValue(game);

    const result = await service.create({ playerId: 1 });
    expect(result).toEqual(game);
  });

  it('should throw an error if player does not exist', async () => {
    jest.spyOn(playerRepository, 'findOne').mockResolvedValue(null);

    await expect(service.create({ playerId: 999 })).rejects.toThrowError('Player not found');
  });

  it('should return all games', async () => {
    const games: Game[] = [
      { id: 1, player: { id: 1, name: 'Alice', games: [] }, isActive: true, frames: [] },
      { id: 2, player: { id: 2, name: 'Bob', games: [] }, isActive: false, frames: [] },
    ];

    jest.spyOn(gameRepository, 'find').mockResolvedValue(games);

    const result = await service.findAll();
    expect(result).toEqual(games);
  });
});
