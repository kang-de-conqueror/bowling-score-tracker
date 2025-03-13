import { Frame } from "../types/frame.type";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchFrames = async (playerId: number, gameId: number): Promise<Frame[]> => {
    const response = await fetch(`${API_BASE_URL}/frames?playerId=${playerId}&gameId=${gameId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch frames");
    }

    return response.json();
};

export const updateFrame = async (
    frameId: number,
    gameId: number,
    playerId: number,
    updates: Partial<Frame>
): Promise<Frame> => {
    const response = await fetch(`${API_BASE_URL}/frames/${frameId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, playerId, ...updates }),
    });

    if (!response.ok) {
        throw new Error("Failed to update frame");
    }

    return response.json();
};
