import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Frame } from './frame.entity';
import { UpdateFrameDto } from './dto/update-frame.dto';

@Injectable()
export class FrameService {
    constructor(
        @InjectRepository(Frame) private readonly frameRepository: Repository<Frame>,
    ) { }

    async updateFrame(frameId: number, updateFrameDto: UpdateFrameDto): Promise<Frame> {
        const { gameId, playerId, ...updates } = updateFrameDto;
        const frame = await this.frameRepository.findOne({
            where: { id: frameId, game: { id: gameId }, player: { id: playerId } },
            relations: ['game', 'player'],
        });

        if (!frame) {
            throw new NotFoundException('Frame not found');
        }

        Object.assign(frame, updates);
        return this.frameRepository.save(frame);
    }

    async findPlayerFrames(gameId: number, playerId: number): Promise<Frame[]> {
        return this.frameRepository.find({
            where: { game: { id: gameId }, player: { id: playerId } },
            relations: ['game', 'player'],
        });
    }

    isFrameComplete(frame: Frame): boolean {
        if (frame.frameNumber === 10) {
            return frame.firstRoll !== null && (frame.secondRoll !== null || frame.firstRoll === "X") && (frame.bonusRoll !== null || frame.secondRoll !== "/");
        }
        return frame.firstRoll !== null && (frame.secondRoll !== null || frame.firstRoll === "X");
    }
}
