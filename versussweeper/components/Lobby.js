import { GameContext } from "@/pages/[id]";
import { useState, useContext, useEffect } from "react";

export default function Lobby() {
    const [sDifficulty, setSDifficulty] = useState("");
    const [loading, setLoading] = useState(false); // will be loading after clicking start game

    const [
        id,
        name,
        difficulty,
        rows,
        cols,
        mines,
        publicRoom,
        stunDuration,
        playerLimit,
        disableFlag,
        disableMiddleMouse,
        seed,
        seedRandomlyGenerated,
        setGameStarted,
        setStartTime,
        hostName,
        setFirstMoveName,
        players,
        socket,
    ] = useContext(GameContext);

    useEffect(() => {
        if (difficulty === 0) {
            setSDifficulty("Easy");
        }
        if (difficulty === 1) {
            setSDifficulty("Medium");
        }
        if (difficulty === 2) {
            setSDifficulty("Hard");
        }
        if (difficulty === 3) {
            setSDifficulty("Custom");
        }
    }, [difficulty]);

    if (loading) {
        return <div>Loading...</div>;
    } else {
        return (
            <div>
                <div>
                    {publicRoom ? "Public" : "Private"} Lobby {id}
                </div>
                <div> Difficulty: {sDifficulty} </div>
                <div> Rows: {rows} </div>
                <div> Columns: {cols} </div>
                <div> Mines: {mines} </div>
                <div> Stun Duration: {stunDuration} </div>
                <div> Flag: {disableFlag ? "Disabled" : "Enabled"} </div>
                <div> Middle Mouse: {disableMiddleMouse ? "Disabled" : "Enabled"} </div>
                <div>
                    {seedRandomlyGenerated ? "Randomly generated " : "Set "}seed: {seed}{" "}
                </div>
                <div>
                    Current players: {Object.keys(players).join(", ")}{" "}
                    {`(${Object.keys(players).length}/${playerLimit})`}
                </div>
                {hostName === name ? (
                    <button
                        onClick={() => {
                            // setGameStarted(true);
                            socket.emit("startGameToServer");
                        }}
                    >
                        Start Game
                    </button>
                ) : (
                    <div>Waiting for host to start game...</div>
                )}
            </div>
        );
    }
}
