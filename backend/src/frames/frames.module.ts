import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Frame } from './frame.entity';
import { FrameService } from './frame.service';
import { FrameController } from './frame.controller';
import { Game } from '../games/game.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Frame, Game])],
  controllers: [FrameController],
  providers: [FrameService],
  exports: [FrameService],
})
export class FramesModule { }
