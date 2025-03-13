import { Game } from "./game.type";
import { Player } from "./player.type";

export type Frame = {
    id: number;
    frameNumber: number;
    firstRoll: string | null;
    secondRoll: string | null;
    bonusRoll: string | null;
    game: Game;
    player: Player;
};
