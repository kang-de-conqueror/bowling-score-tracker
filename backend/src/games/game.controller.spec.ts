import { Test, TestingModule } from '@nestjs/testing';
import { GameController } from './game.controller';
import { GameService } from './game.service';

describe('GameController', () => {
  let controller: GameController;
  let service: GameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [
        {
          provide: GameService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            create: jest.fn().mockResolvedValue({ id: 1, isActive: true, player: { id: 1, name: 'Khang Tran', games: [] } }),
          },
        },
      ],
    }).compile();

    controller = module.get<GameController>(GameController);
    service = module.get<GameService>(GameService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all games', async () => {
    await expect(controller.findAll()).resolves.toEqual([]);
  });

  it('should create a game', async () => {
    const createGameDto = { playerId: 1 };
    const result = await controller.create(createGameDto);
    expect(result).toEqual({ id: 1, isActive: true, player: { id: 1, name: 'Khang Tran', games: [] } });
  });
});
