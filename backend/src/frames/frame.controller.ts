import { Controller, Put, Get, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FrameService } from './frame.service';
import { UpdateFrameDto } from './dto/update-frame.dto';
import { Frame } from './frame.entity';

@ApiTags('Frames')
@Controller('frames')
export class FrameController {
    constructor(private readonly frameService: FrameService) { }

    @ApiOperation({ summary: 'Update frame score' })
    @ApiResponse({ status: 200, description: 'Frame updated successfully.', type: Frame })
    @Put(':frameId')
    updateFrame(
        @Param('frameId') frameId: number,
        @Body() updateFrameDto: UpdateFrameDto
    ) {
        return this.frameService.updateFrame(frameId, updateFrameDto);
    }

    @ApiOperation({ summary: 'Get all frames for a player in a game' })
    @ApiResponse({ status: 200, description: 'Returns all frames of the player in the game.', type: [Frame] })
    @Get()
    findPlayerFrames(
        @Query('gameId') gameId: number,
        @Query('playerId') playerId: number
    ) {
        return this.frameService.findPlayerFrames(gameId, playerId);
    }
}
