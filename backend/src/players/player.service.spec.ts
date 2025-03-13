import { Test, TestingModule } from '@nestjs/testing';
import { PlayerService } from './player.service';
import { Repository } from 'typeorm';
import { Player } from './player.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PlayerService', () => {
  let service: PlayerService;
  let repository: Repository<Player>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
        {
          provide: getRepositoryToken(Player),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PlayerService>(PlayerService);
    repository = module.get<Repository<Player>>(getRepositoryToken(Player));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new player', async () => {
    const playerData = { name: 'Khang Tran' };
    const savedPlayer: Player = { id: 1, name: 'Khang Tran', games: [] };

    jest.spyOn(repository, 'create').mockReturnValue(savedPlayer as any);
    jest.spyOn(repository, 'save').mockResolvedValue(savedPlayer);

    const result = await service.create(playerData);
    expect(result).toEqual(savedPlayer);
  });

  it('should return all players', async () => {
    const players: Player[] = [
      { id: 1, name: 'Alice', games: [] },
      { id: 2, name: 'Bob', games: [] },
    ];

    jest.spyOn(repository, 'find').mockResolvedValue(players);

    const result = await service.findAll();
    expect(result).toEqual(players);
  });
});
