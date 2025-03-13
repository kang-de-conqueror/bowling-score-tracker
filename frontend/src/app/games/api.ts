import { Game } from "../types/game.type";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchGames = async (): Promise<Game[]> => {
    const response = await fetch(`${API_BASE_URL}/games`);

    if (!response.ok) {
        throw new Error("Failed to fetch games");
    }

    return response.json();
};

export const fetchGameById = async (gameId: number): Promise<Game> => {
    const response = await fetch(`${API_BASE_URL}/games/${gameId}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch game with ID: ${gameId}`);
    }

    return response.json();
};

export const createGame = async (playerIds: number[]): Promise<{ gameId: number }> => {
    const response = await fetch(`${API_BASE_URL}/games`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerIds }),
    });

    if (!response.ok) {
        throw new Error("Failed to create game");
    }

    return response.json();
};

export const deleteGame = async (gameId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/games/${gameId}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Failed to delete game");
};

export const fetchScoreboard = async (gameId: number) => {
    const response = await fetch(`${API_BASE_URL}/games/${gameId}/scoreboard`);

    if (!response.ok) {
        throw new Error("Failed to fetch scoreboard");
    }

    return response.json();
};
