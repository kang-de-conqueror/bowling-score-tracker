import { Player } from "../types/player.type";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchPlayers = async (): Promise<Player[]> => {
    const response = await fetch(`${API_BASE_URL}/players`);
    return response.json();
};

export const createPlayer = async (name: string): Promise<Player> => {
    const response = await fetch(`${API_BASE_URL}/players`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
    });
    return response.json();
};
