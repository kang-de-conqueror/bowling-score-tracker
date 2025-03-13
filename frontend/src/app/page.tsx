"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPlayer, fetchPlayers } from "./players/api";
import { createGame } from "./games/api";
import { Player } from "./types/player.type";
import toast, { Toaster } from "react-hot-toast";

export default function HomePage() {
  const router = useRouter();
  const [playerNames, setPlayerNames] = useState<string[]>(["", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const handleInputChange = (index: number, value: string) => {
    const updatedNames = [...playerNames];
    updatedNames[index] = value;
    setPlayerNames(updatedNames);
  };

  const handleStartGame = async () => {
    if (playerNames.some((name) => name.trim() === "")) {
      toast.error("All 5 players must have a name!");
      return;
    }

    setLoading(true);
    try {
      for (const name of playerNames) {
        await createPlayer(name);
      }

      const players: Player[] = await fetchPlayers();
      const selectedPlayerIds = players.slice(-5).map((player) => player.id);

      const game = await createGame(selectedPlayerIds);

      if (game.gameId) {
        toast.success("Game created! Redirecting...");
        setRedirecting(true);
        setTimeout(() => {
          router.push(`/games/${game.gameId}`);
        }, 2000);
      }
    } catch (error) {
      toast.error("Error creating game. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewGames = () => {
    setRedirecting(true);
    setTimeout(() => {
      router.push("/games");
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="w-full max-w-lg bg-gray-800 shadow-2xl rounded-lg p-8 text-center relative">

        <button
          onClick={handleViewGames}
          className="cursor-pointer w-full mb-6 py-3 px-6 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-4 focus:ring-blue-300"
          disabled={redirecting}
        >
          {redirecting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Redirecting...</span>
            </div>
          ) : (
            "🎮 View Created Games"
          )}
        </button>

        <h1 className="text-4xl font-bold text-yellow-400 mb-4">🎳 Bowling Score Tracker</h1>
        <p className="text-lg text-gray-300 mb-6">Enter 5 player names to start the game!</p>

        <div className="space-y-3">
          {playerNames.map((name, index) => (
            <input
              key={index}
              type="text"
              value={name}
              onChange={(e) => handleInputChange(index, e.target.value)}
              placeholder={`Player ${index + 1}`}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            />
          ))}
        </div>

        <button
          onClick={handleStartGame}
          className="cursor-pointer mt-6 w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-6 rounded-lg text-lg transition transform hover:scale-105 focus:outline-none disabled:opacity-50"
          disabled={loading || redirecting}
        >
          {redirecting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
              <span>Starting Game...</span>
            </div>
          ) : (
            "Start Game 🚀"
          )}
        </button>
      </div>
    </div>
  );
}
