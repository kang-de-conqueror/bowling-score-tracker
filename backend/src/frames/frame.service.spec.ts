import { Test, TestingModule } from '@nestjs/testing';
import { FrameService } from './frame.service';
import { Repository } from 'typeorm';
import { Frame } from './frame.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Game } from '../games/game.entity';
import { Player } from '../players/player.entity';
import { UpdateFrameDto } from './dto/update-frame.dto';
import { NotFoundException } from '@nestjs/common';

describe('FrameService', () => {
  let service: FrameService;
  let repository: Repository<Frame>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FrameService,
        {
          provide: getRepositoryToken(Frame),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<FrameService>(FrameService);
    repository = module.get<Repository<Frame>>(getRepositoryToken(Frame));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all frames for a player in a game', async () => {
    const gameId = 1;
    const playerId = 1;

    const frames: Frame[] = [
      {
        id: 1,
        frameNumber: 1,
        firstRoll: 'X',
        secondRoll: null,
        bonusRoll: null,
        game: { id: gameId, isActive: true, players: [], frames: [] } as Game,
        player: { id: playerId, name: 'Alice', games: [], frames: [] } as Player,
      },
      {
        id: 2,
        frameNumber: 2,
        firstRoll: '5',
        secondRoll: '/',
        bonusRoll: null,
        game: { id: gameId, isActive: true, players: [], frames: [] } as Game,
        player: { id: playerId, name: 'Alice', games: [], frames: [] } as Player,
      },
    ];

    jest.spyOn(repository, 'find').mockResolvedValue(frames);

    const result = await service.findPlayerFrames(gameId, playerId);
    expect(result).toEqual(frames);
  });

  it('should update a frame', async () => {
    const frameId = 1;
    const frame: Frame = {
      id: frameId,
      frameNumber: 1,
      firstRoll: null,
      secondRoll: null,
      bonusRoll: null,
      game: { id: 1, isActive: true, players: [], frames: [] } as Game,
      player: { id: 1, name: 'Alice', games: [], frames: [] } as Player,
    };

    const updateData: UpdateFrameDto = { gameId: 1, playerId: 1, firstRoll: 'X' };
    const updatedFrame: Frame = { ...frame, firstRoll: 'X' };

    jest.spyOn(repository, 'findOne').mockResolvedValue(frame);
    jest.spyOn(repository, 'save').mockResolvedValue(updatedFrame);

    const result = await service.updateFrame(frameId, updateData);
    expect(result).toEqual(updatedFrame);
  });

  it('should throw an error if frame is not found', async () => {
    const frameId = 999;
    const updateData: UpdateFrameDto = { gameId: 1, playerId: 1, firstRoll: 'X' };

    jest.spyOn(repository, 'findOne').mockResolvedValue(null);

    await expect(service.updateFrame(frameId, updateData)).rejects.toThrowError(NotFoundException);
  });

  it('should correctly identify frame completion', () => {
    const frame = {
      id: 1,
      frameNumber: 1,
      firstRoll: 'X',
      secondRoll: null,
      bonusRoll: null,
      game: { id: 1, isActive: true, players: [], frames: [] } as Game,
      player: { id: 1, name: 'Alice', games: [], frames: [] } as Player,
    } as Frame;

    const result = service.isFrameComplete(frame);
    expect(result).toBe(true);
  });
});
