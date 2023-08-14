import { useRouter } from "next/router";
import { useState, useEffect, createContext } from "react";
import io from "socket.io-client";
import Loading from "@/components/Loading";

import Layout from "@/components/Layout";
import Head from "next/head";
import dynamic from "next/dynamic";

const ChooseName = dynamic(() => import("../components/chooseName/ChooseName"), {
    ssr: false,
    loading: () => <Loading />,
});
const GameFull = dynamic(() => import("../components/gameFull/GameFull"), {
    ssr: false,
    loading: () => <Loading />,
});
const GameNotFound = dynamic(() => import("../components/gameNotFound/GameNotFound"), {
    ssr: false,
    loading: () => <Loading />,
});
const Lobby = dynamic(() => import("../components/lobby/Lobby"), {
    ssr: false,
    loading: () => <Loading />,
});
const Minesweeper = dynamic(() => import("../components/Minesweeper"), {
    ssr: false,
    loading: () => <Loading />,
});


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
    const [finishTime, setFinishTime] = useState(1682900908681 * 2);

    // playerObj from redis
    const [flags, setFlags] = useState(0);
    const [stun, setStun] = useState(-1);
    const [revealed, setRevealed] = useState([]);
    const [flagged, setFlagged] = useState([]);

    const [board, setBoard] = useState([]);
    const [isCtrlPressed, setIsCtrlPressed] = useState(false);
    const [stunTimer, setStunTimer] = useState(-1);

    const [showNextGame, setShowNextGame] = useState(false);

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
            // socket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/socket.io`, {
            //socket = io(`http://18.221.11.188:3001/`, {
            socket = io("https://versussweeper.com/", {
                path: "/api/socket.io",
                query: { id },
            });
            // socket = io(`https://stupidbigidiot.com/api`, { query: { id } });

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
                    // check if key in players
                    if (data.name in temp_players) {
                        let temp_players2 = { ...temp_players };
                        console.log("updating players test");
                        temp_players2[data.name].clears = data.hits;
                        temp_players2[data.name].misses = data.misses;
                        if (data.finishTime !== 1682900908681 * 2) {
                            temp_players2[data.name].finishTime = data.finishTime;
                            setShowNextGame(true);
                        }
                        return temp_players2;
                    }
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
            return () => {
                console.log("disconnecting socket. ready state", socket.readyState);
                if (socket.readyState === 1) {
                    console.log("ready state", socket.readyState);
                    socket.disconnect();
                }
            };
        }
    }, [id]);

    // Still checking if game exists
    if (loading) {
        // head is fine as is here
        return (
            <>
                <Loading />;
            </>
        );
    } else {
        // Game doesn't exist
        if (!gameFound) {
            // head is fine as is here
            return <GameNotFound />;
        }
        // Game exists
        else {
            if (!name) {
                return (
                  <>
                    <Head>
                      <title>{id} | Versus Sweeper</title>
                    </Head>
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
                        setShowNextGame,
                      ]}
                    >
                      <ChooseName />
                    </GameContext.Provider>
                  </>
                );
            } else {
                if (gameFull) {
                    // head is fine as is here
                    return <GameFull />;
                } else if (!gameStarted) {
                    return (
                      <>
                        <Head>
                          <title>{id} | Versus Sweeper</title>
                        </Head>
                        <Layout>
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
                        </Layout>
                      </>
                    );
                } else {
                    return (
                      <>
                        <Head>
                          <title>{id} | Versus Sweeper</title>
                        </Head>
                        <Layout>
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
                              finishTime,
                              setFinishTime,
                              showNextGame,
                              setShowNextGame,
                              difficulty,
                              publicRoom,
                              playerLimit,
                              setPlayers,
                            ]}
                          >
                            <Minesweeper />
                          </GameContext.Provider>
                        </Layout>
                      </>
                    );
                }
            }
        }
    }
};

export default Page;
