import { Game } from "./game.type";

export type Player = {
    id: number;
    name: string;
    games: Game[];
};
