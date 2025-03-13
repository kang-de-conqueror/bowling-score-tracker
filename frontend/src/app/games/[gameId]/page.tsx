"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { fetchGameById } from "../api";
import { fetchFrames, updateFrame } from "../../frames/api";
import { Game } from "../../types/game.type";
import { Frame } from "../../types/frame.type";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Scoreboard from "../../components/Scoreboard";

export default function GameDetailsPage() {
    const { gameId } = useParams();
    const router = useRouter();
    const [game, setGame] = useState<Game | null>(null);
    const [frames, setFrames] = useState<Frame[]>([]);
    const [submittedFrames, setSubmittedFrames] = useState<Record<number, boolean>>({});
    const [currentFrameNumber, setCurrentFrameNumber] = useState<number>(1);

    const [showScoreboardModal, setShowScoreboardModal] = useState(false);

    useEffect(() => {
        fetchGameById(Number(gameId))
            .then(setGame)
            .catch(() => toast.error("Failed to fetch game details."));
    }, [gameId]);

    useEffect(() => {
        if (game) {
            Promise.all(game.players.map((p) => fetchFrames(p.id, Number(gameId))))
                .then((playersFrames) => {
                    const allFrames = playersFrames.flat();
                    setFrames(allFrames);

                    const preSubmitted = allFrames.reduce((acc, frame) => {
                        acc[frame.id] = Boolean(isFrameComplete(frame));
                        return acc;
                    }, {} as Record<number, boolean>);
                    setSubmittedFrames(preSubmitted);
                })
                .catch(() => toast.error("Failed to fetch frames."));
        }
    }, [game, gameId]);

    const isFrameComplete = (frame: Frame) => {
        if (frame.frameNumber < 10) {
            if (frame.firstRoll === "X") return true;
            return (
                frame.firstRoll &&
                frame.firstRoll !== "-" &&
                frame.secondRoll &&
                frame.secondRoll !== "-"
            );
        } else {
            if (!frame.firstRoll || frame.firstRoll === "-") return false;
            if (frame.firstRoll === "X") {
                return (
                    frame.secondRoll && frame.secondRoll !== "-" &&
                    frame.bonusRoll && frame.bonusRoll !== "-"
                );
            }
            if (frame.secondRoll === "/") {
                return frame.bonusRoll && frame.bonusRoll !== "-";
            }
            return (
                frame.firstRoll !== "-" &&
                frame.secondRoll &&
                frame.secondRoll !== "-"
            );
        }
    };

    const handleUpdateFrame = (
        frameId: number,
        field: "firstRoll" | "secondRoll" | "bonusRoll",
        value: string
    ) => {
        setFrames((prevFrames) =>
            prevFrames.map((f) => (f.id === frameId ? { ...f, [field]: value } : f))
        );
    };

    const handleSubmitFrame = async (frame: Frame) => {
        if (!game) {
            toast.error("Game data is missing.");
            return;
        }
        try {
            await updateFrame(frame.id, game.id, frame.player.id, {
                firstRoll: frame.firstRoll,
                secondRoll: frame.secondRoll,
                bonusRoll: frame.bonusRoll,
            });
            toast.success(`Frame ${frame.frameNumber} submitted for ${frame.player.name}!`);
            setSubmittedFrames((prev) => ({ ...prev, [frame.id]: true }));

            if (frame.frameNumber === 10) {
                const all10thDone = frames
                    .filter((f) => f.frameNumber === 10)
                    .map((f) => f.id)
                    .every((id) => {
                        if (id === frame.id) return true;
                        return submittedFrames[id];
                    });

                if (all10thDone) {
                    setShowScoreboardModal(true);
                }
            }
        } catch {
            toast.error("Submission failed. Try again.");
        }
    };

    const handleNextFrame = () => {
        if (!game) return;
        const allSubmitted = game.players.every((p) => {
            const pf = frames.find(
                (f) => f.player.id === p.id && f.frameNumber === currentFrameNumber
            );
            return pf && submittedFrames[pf.id];
        });
        if (!allSubmitted) {
            toast.error("Not all players have submitted their scores for this frame.");
            return;
        }
        setCurrentFrameNumber((prev) => prev + 1);
    };

    const handlePrevFrame = () => {
        setCurrentFrameNumber((prev) => Math.max(prev - 1, 1));
    };

    const shouldShowSecondRoll = (frame: Frame) => {
        if (!frame.firstRoll || frame.firstRoll === "-") return false;
        if (frame.frameNumber < 10) {
            return frame.firstRoll !== "X";
        }
        return true;
    };

    const shouldShowBonusRoll = (frame: Frame) => {
        if (frame.frameNumber < 10) return false;
        if (frame.firstRoll === "X") {
            return frame.secondRoll && frame.secondRoll !== "-";
        }
        return frame.secondRoll === "/";
    };

    const getSecondRollOptions = (frame: Frame): string[] => {
        const { frameNumber, firstRoll } = frame;
        if (!firstRoll || firstRoll === "-") return [];
        if (frameNumber < 10) {
            if (firstRoll === "X") return [];
            const k = Number(firstRoll);
            if (isNaN(k)) return [];
            const leftover = 9 - k;
            const numericRange = Array.from({ length: leftover + 1 }, (_, i) => i.toString());
            return ["-"].concat(numericRange, "/");
        } else {
            return [
                "-", "0", "1", "2", "3", "4",
                "5", "6", "7", "8", "9", "X", "/"
            ];
        }
    };

    const getBonusRollOptions = (frame: Frame): string[] => {
        if (frame.frameNumber < 10) return [];
        return [
            "-", "0", "1", "2", "3", "4",
            "5", "6", "7", "8", "9", "X", "/"
        ];
    };

    return (
        <div className="flex flex-col items-center p-6 bg-gray-900 min-h-screen text-white">
            <Toaster position="top-center" />

            <div className="w-full max-w-4xl flex justify-between mb-6">
                <button
                    onClick={() => router.push("/games")}
                    className="cursor-pointer bg-gray-700 px-4 py-2 rounded-lg font-semibold"
                >
                    ⬅ Back to Games
                </button>

                <button
                    onClick={() => setShowScoreboardModal(true)}
                    className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition transform hover:scale-105"
                >
                    Show Scoreboard
                </button>
            </div>

            <h1 className="text-3xl font-bold text-yellow-400 mb-4">Game #{gameId}</h1>
            <p className="text-lg text-gray-300 mb-6">Players play frame by frame together</p>

            {game && (
                <div className="w-full max-w-4xl bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-yellow-400 mb-4 text-center">
                        Frame {currentFrameNumber}
                    </h2>

                    <ul className="space-y-4">
                        {game.players.map((player) => {
                            const playerFrame = frames.find(
                                (f) => f.player.id === player.id && f.frameNumber === currentFrameNumber
                            );
                            if (!playerFrame) return null;

                            return (
                                <li
                                    key={playerFrame.id}
                                    className="flex flex-col md:flex-row md:justify-between items-center bg-gray-700 p-4 rounded-lg shadow-md"
                                >
                                    <span className="text-lg font-bold w-full md:w-1/4 text-center mb-2 md:mb-0">
                                        {player.name}
                                    </span>

                                    <div className="flex justify-center items-center w-full md:w-1/2 space-x-4">
                                        <select
                                            value={playerFrame.firstRoll ?? "-"}
                                            onChange={(e) =>
                                                handleUpdateFrame(playerFrame.id, "firstRoll", e.target.value)
                                            }
                                            className="p-2 bg-gray-600 text-white rounded-lg text-center"
                                            disabled={submittedFrames[playerFrame.id]}
                                        >
                                            <option value="-">-</option>
                                            {Array.from({ length: 10 }, (_, i) => i.toString()).map((opt) => (
                                                <option key={opt} value={opt}>
                                                    {opt}
                                                </option>
                                            ))}
                                            <option value="X">X</option>
                                        </select>

                                        {shouldShowSecondRoll(playerFrame) && (
                                            <select
                                                value={playerFrame.secondRoll ?? "-"}
                                                onChange={(e) =>
                                                    handleUpdateFrame(playerFrame.id, "secondRoll", e.target.value)
                                                }
                                                className="p-2 bg-gray-600 text-white rounded-lg text-center"
                                                disabled={submittedFrames[playerFrame.id]}
                                            >
                                                {getSecondRollOptions(playerFrame).map((opt) => (
                                                    <option key={opt} value={opt}>
                                                        {opt}
                                                    </option>
                                                ))}
                                            </select>
                                        )}

                                        {shouldShowBonusRoll(playerFrame) && (
                                            <select
                                                value={playerFrame.bonusRoll ?? "-"}
                                                onChange={(e) =>
                                                    handleUpdateFrame(playerFrame.id, "bonusRoll", e.target.value)
                                                }
                                                className="p-2 bg-gray-600 text-white rounded-lg text-center"
                                                disabled={submittedFrames[playerFrame.id]}
                                            >
                                                {getBonusRollOptions(playerFrame).map((opt) => (
                                                    <option key={opt} value={opt}>
                                                        {opt}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </div>

                                    <div className="mt-2 md:mt-0">
                                        {submittedFrames[playerFrame.id] ? (
                                            <CheckCircleIcon className="w-6 h-6 text-green-500" />
                                        ) : (
                                            <button
                                                onClick={() => handleSubmitFrame(playerFrame)}
                                                className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded-lg text-sm"
                                            >
                                                Submit
                                            </button>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>

                    <div className="flex justify-between mt-6 w-full">
                        {currentFrameNumber > 1 ? (
                            <button
                                onClick={handlePrevFrame}
                                className="cursor-pointer bg-gray-500 px-6 py-3 rounded-lg font-bold"
                            >
                                Prev Frame
                            </button>
                        ) : (
                            <div />
                        )}

                        {currentFrameNumber < 10 && (
                            <button
                                onClick={handleNextFrame}
                                className="cursor-pointer bg-yellow-500 px-6 py-3 rounded-lg font-bold"
                            >
                                Next Frame
                            </button>
                        )}
                    </div>
                </div>
            )}

            {showScoreboardModal && (
                <Scoreboard
                    gameId={Number(gameId)}
                    onClose={() => setShowScoreboardModal(false)}
                />
            )}
        </div>
    );
}
