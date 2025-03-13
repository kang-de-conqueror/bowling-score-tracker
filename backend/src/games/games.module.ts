import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './game.entity';
import { Player } from '../players/player.entity';
import { Frame } from '../frames/frame.entity';
import { GameService } from './game.service';
import { GameController } from './game.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game, Player, Frame]),
  ],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService],
})
export class GamesModule { }
