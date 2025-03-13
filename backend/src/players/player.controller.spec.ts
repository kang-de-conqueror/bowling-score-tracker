import { Test, TestingModule } from '@nestjs/testing';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';

describe('PlayerController', () => {
  let controller: PlayerController;
  let service: PlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerController],
      providers: [
        {
          provide: PlayerService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            create: jest.fn().mockResolvedValue({ id: 1, name: 'Khang Tran', games: [] }),
          },
        },
      ],
    }).compile();

    controller = module.get<PlayerController>(PlayerController);
    service = module.get<PlayerService>(PlayerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all players', async () => {
    await expect(controller.findAll()).resolves.toEqual([]);
  });

  it('should create a player', async () => {
    const createPlayerDto = { name: 'Khang Tran' };
    const result = await controller.create(createPlayerDto);
    expect(result).toEqual({ id: 1, name: 'Khang Tran', games: [] });
  });
});
