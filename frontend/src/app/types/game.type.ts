import { Player } from "./player.type";

export type Game = {
    id: number;
    isActive: boolean;
    players: Player[];
};
