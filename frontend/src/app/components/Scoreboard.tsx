"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchScoreboard } from "../games/api";
import { XCircleIcon } from "@heroicons/react/24/solid";

/**
 * The parent must control rendering:
 *   { showScoreboard && (
 *     <Scoreboard gameId={someId} onClose={...} />
 *   ) }
 */
type ScoreboardProps = {
    /** The game ID to display in the scoreboard. */
    gameId: number;
    /** Called when the scoreboard's X is clicked, e.g. set showScoreboard=false. */
    onClose: () => void;
};

type FrameInfo = {
    frameNumber: number;
    scoreInput: string;
};

type PlayerScoreData = {
    player: string;
    frames: FrameInfo[];
    totalScore: number;
};

export default function Scoreboard({ gameId, onClose }: ScoreboardProps) {
    const [scoreboard, setScoreboard] = useState<PlayerScoreData[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadScores();
    }, [gameId]);

    async function loadScores() {
        setLoading(true);
        try {
            const data = await fetchScoreboard(gameId);
            setScoreboard(data);
        } catch {
            toast.error("Failed to fetch scoreboard data.");
        } finally {
            setLoading(false);
        }
    }

    function handleClose() {
        onClose();
    }

    const gameIsDone = scoreboard.length > 0 && scoreboard.every((p) => {
        if (p.frames.length < 10) return false;
        const lastFrame = p.frames[9];
        return lastFrame.scoreInput !== "-";
    });

    const highestScore = scoreboard.reduce(
        (max, p) => Math.max(max, p.totalScore),
        0
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-[90%] max-w-5xl text-white relative">
                <button
                    onClick={handleClose}
                    className="absolute right-2 top-2 text-gray-400 hover:text-white cursor-pointer"
                >
                    <XCircleIcon className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold text-yellow-400 mb-4">
                    Scoreboard for Game #{gameId}
                </h2>

                {loading ? (
                    <p className="text-gray-300">Loading scores...</p>
                ) : scoreboard.length === 0 ? (
                    <p className="text-gray-300">No scoreboard data found.</p>
                ) : (
                    <div className="overflow-auto max-h-[70vh] border border-gray-700">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-700 sticky top-0">
                                <tr>
                                    <th className="border border-gray-600 px-4 py-2">Frame</th>
                                    {scoreboard.map(({ player }) => (
                                        <th
                                            key={`player-${player}`}
                                            className="border border-gray-600 px-4 py-2"
                                        >
                                            {player}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: 10 }, (_, i) => i + 1).map((frameNum) => (
                                    <tr key={frameNum} className="bg-gray-900">
                                        <td className="border border-gray-600 px-4 py-2 font-bold">
                                            {frameNum}
                                        </td>
                                        {scoreboard.map(({ player, frames }) => {
                                            const frame = frames.find((f) => f.frameNumber === frameNum);
                                            return (
                                                <td
                                                    key={`frame-${frameNum}-player-${player}`}
                                                    className="border border-gray-600 px-4 py-2"
                                                >
                                                    {frame?.scoreInput || "-"}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                                <tr className="bg-gray-800 font-bold">
                                    <td className="border border-gray-600 px-4 py-2">Total</td>
                                    {scoreboard.map(({ player, totalScore }) => {
                                        const isTopScorer = totalScore === highestScore;
                                        let label = "";
                                        if (isTopScorer) {
                                            label = gameIsDone ? "Winner" : "Ready to Win";
                                        }
                                        return (
                                            <td
                                                key={`total-player-${player}`}
                                                className={`border border-gray-600 px-4 py-2 ${isTopScorer ? "text-green-400 font-bold" : ""
                                                    }`}
                                            >
                                                {totalScore}
                                                {label && (
                                                    <span className="ml-2 bg-green-700 text-white rounded-full px-2 py-1 text-sm">
                                                        {label}
                                                    </span>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
