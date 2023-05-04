import { useRouter } from "next/router";
import { useState, useEffect, createContext } from "react";
import ChooseName from "../components/ChooseName";
import GameFull from "../components/GameFull";
import GameNotFound from "../components/GameNotFound";
import Lobby from "../components/Lobby";
import Minesweeper from "../components/minesweeper";
import io from "socket.io-client";

export const GameContext = createContext();

let socket = null;
const Page = () => {
    const router = useRouter();
    const { id } = router.query;
    const [loading, setLoading] = useState(true); // Are we loading?
    const [gameFound, setGameFound] = useState(false); // Does the game exist?

    const [name, setName] = useState(""); // User's name
    const [gameFull, setGameFull] = useState(false); // Is the game full?

    // gameData from redis
    const [difficulty, setDifficulty] = useState(0);
    const [rows, setRows] = useState(9);
    const [cols, setCols] = useState(9);
    const [mines, setMines] = useState(10);
    const [publicRoom, setPublicRoom] = useState(true);
    const [stunDuration, setStunDuration] = useState(5);
    const [playerLimit, setPlayerLimit] = useState(8);
    const [disableFlag, setDisableFlag] = useState(false);
    const [disableMiddleMouse, setDisableMiddleMouse] = useState(false);
    const [seed, setSeed] = useState("9202723864");
    const [seedRandomlyGenerated, setSeedRandomlyGenerated] = useState(true);
    const [nextGameId, setNextGameId] = useState("");
    const [gameStarted, setGameStarted] = useState(false);
    const [startTime, setStartTime] = useState(-1);
    const [hostName, setHostName] = useState("");
    const [firstMoveName, setFirstMoveName] = useState("");
    const [firstColClicked, setFirstColClicked] = useState(-1);
    const [firstRowClicked, setFirstRowClicked] = useState(-1);
    const [players, setPlayers] = useState({});

    // playerElem from redis
    const [clears, setClears] = useState(0);
    const [misses, setMisses] = useState(0);
    const [finishTime, setFinishTime] = useState(-1);

    // playerObj from redis
    const [flags, setFlags] = useState(0);
    const [stun, setStun] = useState(-1);
    const [revealed, setRevealed] = useState([]);
    const [flagged, setFlagged] = useState([]);

    const [board, setBoard] = useState([]);
    const [isCtrlPressed, setIsCtrlPressed] = useState(false);
    const [stunTimer, setStunTimer] = useState(-1);

    useEffect(() => {
        function handleKeyDown(event) {
            if (event.ctrlKey) {
                setIsCtrlPressed(true);
            }
        }

        function handleKeyUp(event) {
            if (event.keyCode === 17) {
                setIsCtrlPressed(false);
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    useEffect(() => {
        if (id) {
            socket = io("http://localhost:3001", { query: { id } });

            socket.on("newPlayer", (data) => {
                setPlayers((prevPlayers) => {
                    let tempPlayers = { ...prevPlayers };
                    const nPlayer = {
                        name: data.name,
                        clears: 0,
                        misses: 0,
                        finishTime: 1682900908681 * 2, // time in the far far future, for when the user has not actually finished yet
                    };
                    tempPlayers[data.name] = nPlayer;
                    return tempPlayers;
                });
            });

            socket.on("startGameToClient", (data) => {
                setFirstMoveName(data.firstMoveName);
                setGameStarted(true);
            });

            socket.on("firstMoveToClient", (data) => {
                setFirstColClicked(data.firstColClicked);
                setFirstRowClicked(data.firstRowClicked);
                setStartTime(data.startTime);
            });

            socket.on("revealToClient", (data) => {
                setPlayers((temp_players) => {
                    let temp_players2 = { ...temp_players };
                    console.log("updating players test");
                    temp_players2[data.name].clears = data.hits;
                    temp_players2[data.name].misses = data.misses;
                    return temp_players2;
                });
            });
            // Check if game exists
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exists`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.exists) {
                        setGameFound(true);
                    } else {
                        setGameFound(false);
                    }
                    setLoading(false);
                });
        }
    }, [id]);

    // Still checking if game exists
    if (loading) {
        return <div> Loading... </div>;
    } else {
        // Game doesn't exist
        if (!gameFound) {
            return <GameNotFound />;
        }
        // Game exists
        else {
            if (!name) {
                return (
                    <GameContext.Provider
                        value={[
                            id,
                            setDifficulty,
                            setRows,
                            setCols,
                            setMines,
                            setPublicRoom,
                            setStunDuration,
                            setPlayerLimit,
                            setDisableFlag,
                            setDisableMiddleMouse,
                            setSeed,
                            setSeedRandomlyGenerated,
                            setNextGameId,
                            setGameStarted,
                            setStartTime,
                            setHostName,
                            setFirstMoveName,
                            setFirstColClicked,
                            setFirstRowClicked,
                            setPlayers,
                            setClears,
                            setMisses,
                            setFinishTime,
                            setFlags,
                            setStun,
                            setRevealed,
                            setFlagged,
                            setName,
                            setGameFull,
                            socket,
                            stunTimer,
                            setStunTimer,
                        ]}
                    >
                        <ChooseName />
                    </GameContext.Provider>
                );
            } else {
                if (gameFull) {
                    return <GameFull />;
                } else if (!gameStarted) {
                    return (
                        <GameContext.Provider
                            value={[
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
                            ]}
                        >
                            <Lobby />
                        </GameContext.Provider>
                    );
                } else {
                    return (
                        <GameContext.Provider
                            value={[
                                rows,
                                cols,
                                mines,
                                board,
                                setBoard,
                                revealed,
                                setRevealed,
                                flagged,
                                setFlagged,
                                stun,
                                setStun,
                                clears,
                                setClears,
                                misses,
                                setMisses,
                                seed,
                                id,
                                firstRowClicked,
                                setFirstRowClicked,
                                firstColClicked,
                                setFirstColClicked,
                                startTime,
                                setStartTime,
                                flags,
                                setFlags,
                                isCtrlPressed,
                                setIsCtrlPressed,
                                disableFlag,
                                setDisableFlag,
                                disableMiddleMouse,
                                setDisableMiddleMouse,
                                stunDuration,
                                name,
                                firstMoveName,
                                socket,
                                stunTimer,
                                setStunTimer,
                                players,
                            ]}
                        >
                            <Minesweeper />
                        </GameContext.Provider>
                    );
                }
            }
        }
    }
};

export default Page;
