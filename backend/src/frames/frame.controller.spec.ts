import { Test, TestingModule } from '@nestjs/testing';
import { FrameController } from './frame.controller';
import { FrameService } from './frame.service';
import { UpdateFrameDto } from './dto/update-frame.dto';
import { NotFoundException } from '@nestjs/common';

describe('FrameController', () => {
  let controller: FrameController;
  let service: FrameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FrameController],
      providers: [
        {
          provide: FrameService,
          useValue: {
            findPlayerFrames: jest.fn().mockResolvedValue([]),
            updateFrame: jest.fn().mockResolvedValue({
              id: 1,
              firstRoll: 'X',
              secondRoll: null,
              totalScore: 10,
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<FrameController>(FrameController);
    service = module.get<FrameService>(FrameService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all frames for a player in a game', async () => {
    await expect(controller.findPlayerFrames(1, 1)).resolves.toEqual([]);
    expect(service.findPlayerFrames).toHaveBeenCalledWith(1, 1);
  });

  it('should update a frame', async () => {
    const frameId = 1;
    const updateData: UpdateFrameDto = { gameId: 1, playerId: 1, firstRoll: 'X' };

    const result = await controller.updateFrame(frameId, updateData);
    expect(result).toEqual({
      id: 1,
      firstRoll: 'X',
      secondRoll: null,
      totalScore: 10,
    });
    expect(service.updateFrame).toHaveBeenCalledWith(frameId, updateData);
  });

  it('should throw NotFoundException if frame does not exist', async () => {
    jest.spyOn(service, 'updateFrame').mockRejectedValue(new NotFoundException('Frame not found'));

    await expect(controller.updateFrame(999, { gameId: 1, playerId: 1, firstRoll: 'X' }))
      .rejects.toThrowError(NotFoundException);
  });
});
