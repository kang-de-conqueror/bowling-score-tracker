"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchGames, deleteGame } from "./api";
import { Game } from "../types/game.type";
import toast, { Toaster } from "react-hot-toast";
import {
    ArrowRightCircleIcon,
    TrashIcon,
    TableCellsIcon,
} from "@heroicons/react/24/solid";
import Scoreboard from "../components/Scoreboard";

export default function GamesPage() {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [deletingGameId, setDeletingGameId] = useState<number | null>(null);

    const [scoreboardGameId, setScoreboardGameId] = useState<number | null>(null);
    const [scoreboardOpen, setScoreboardOpen] = useState(false);

    const router = useRouter();

    useEffect(() => {
        loadGames();
    }, []);

    const loadGames = () => {
        setLoading(true);
        fetchGames()
            .then((data) => {
                setGames(data);
            })
            .catch(() => {
                toast.error("Failed to fetch games.");
            })
            .finally(() => setLoading(false));
    };

    const handleContinueGame = (gameId: number) => {
        router.push(`/games/${gameId}`);
    };

    const handleDeleteGame = async (gameId: number) => {
        setDeletingGameId(gameId);
        try {
            await deleteGame(gameId);
            setGames((prev) => prev.filter((g) => g.id !== gameId));
            toast.success("Game deleted successfully.");
        } catch {
            toast.error("Failed to delete game.");
        } finally {
            setDeletingGameId(null);
        }
    };

    const handleShowScoreboard = (gameId: number) => {
        setScoreboardGameId(gameId);
        setScoreboardOpen(true);
    };

    const handleCloseScoreboard = () => {
        setScoreboardGameId(null);
        setScoreboardOpen(false);
    };

    return (
        <div className="flex flex-col items-center p-6 bg-gray-900 min-h-screen text-white">
            <Toaster position="top-center" />

            <div className="w-full max-w-md flex justify-between mb-6">
                <button
                    onClick={() => router.push("/")}
                    className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition transform hover:scale-105"
                >
                    ⬅ Back to Home
                </button>
            </div>

            <h1 className="text-3xl font-bold text-yellow-400 mb-4">Games List</h1>

            {loading ? (
                <div className="flex flex-col items-center mt-6">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-yellow-400"></div>
                    <p className="text-lg text-gray-300 mt-4">Loading games...</p>
                </div>
            ) : games.length === 0 ? (
                <p className="text-lg text-red-500 font-semibold mt-4">
                    No games were created
                </p>
            ) : (
                <div className="w-full max-w-2xl overflow-x-auto">
                    <table className="w-full text-left border-collapse border border-gray-700">
                        <thead className="bg-gray-800 text-yellow-400">
                            <tr>
                                <th className="px-4 py-3 border border-gray-700">#</th>
                                <th className="px-4 py-3 border border-gray-700">Game ID</th>
                                <th className="px-4 py-3 border border-gray-700 text-center">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {games.map((game, index) => (
                                <tr
                                    key={game.id}
                                    className="bg-gray-700 hover:bg-gray-600 transition"
                                >
                                    <td className="px-4 py-3 border border-gray-700">
                                        {index + 1}
                                    </td>
                                    <td className="px-4 py-3 border border-gray-700">
                                        Game #{game.id}
                                    </td>
                                    <td className="px-4 py-3 border border-gray-700 flex justify-center space-x-4">
                                        <button
                                            onClick={() => handleContinueGame(game.id)}
                                            className="cursor-pointer text-green-400 hover:text-green-500 transition"
                                            title="Continue Game"
                                        >
                                            <ArrowRightCircleIcon className="w-6 h-6" />
                                        </button>

                                        <button
                                            onClick={() => handleShowScoreboard(game.id)}
                                            className="cursor-pointer text-blue-400 hover:text-blue-500 transition"
                                            title="Show Scoreboard"
                                        >
                                            <TableCellsIcon className="w-6 h-6" />
                                        </button>

                                        <button
                                            onClick={() => handleDeleteGame(game.id)}
                                            className="cursor-pointer text-red-500 hover:text-red-600 transition"
                                            title="Delete Game"
                                            disabled={deletingGameId === game.id}
                                        >
                                            {deletingGameId === game.id ? (
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
                                            ) : (
                                                <TrashIcon className="w-6 h-6" />
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {scoreboardOpen && scoreboardGameId && (
                <Scoreboard
                    gameId={scoreboardGameId}
                    onClose={() => setScoreboardOpen(false)}
                />
            )}


        </div>
    );
}
