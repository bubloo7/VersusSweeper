import { useRouter } from "next/router";
import { useState, useEffect, createContext } from "react";
import { ref, onValue } from "firebase/database";
import db from "../firebase/clientApp";
import Lobby from "../components/Lobby";
import Minesweeper from "../components/Minesweeper";

export const GameContext = createContext();

const Page = () => {
    const router = useRouter();
    const { id } = router.query;
    const [loading, setLoading] = useState(true);
    const [gameFound, setGameFound] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [rows, setRows] = useState(9);
    const [cols, setCols] = useState(9);
    const [mines, setMines] = useState(10);

    const [board, setBoard] = useState([]);
    const [revealed, setRevealed] = useState([]);
    const [flagged, setFlagged] = useState([]);
    const [lastMiss, setLastMiss] = useState([]);
    const [hits, setHits] = useState(0);
    const [misses, setMisses] = useState(0);
    const [salt, setSalt] = useState(0);
    const [firstRowClicked, setFirstRowClicked] = useState(-1);
    const [firstColClicked, setFirstColClicked] = useState(-1);
    const [startTime, setStartTime] = useState(-1);
    const [numFlags, setNumFlags] = useState(0);
    const [isCtrlPressed, setIsCtrlPressed] = useState(false);

    useEffect(() => {
        function handleKeyDown(event) {
            if (event.ctrlKey) {
                setIsCtrlPressed(true);
                console.log("ctrl pressed", event.ctrlKey);
            }
        }

        function handleKeyUp(event) {

            if (event.keyCode === 17) {
                setIsCtrlPressed(false);
                console.log("ctrl released");
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
            // get data stored in "game"
            const gameRef = ref(db, "rooms/" + id); //"game");
            onValue(gameRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setGameFound(true);
                } else setGameFound(false);
                setLoading(false);
            });
        }
    }, [id]);

    if (loading) return <p>Loading...</p>; // still checking database if game exists
    else {
        if (gameFound) {
            // Game exists! but are we in the lobby or has the game started?
            if (gameStarted) {
                // game started, render minesweeper
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
                            lastMiss,
                            setLastMiss,
                            hits,
                            setHits,
                            misses,
                            setMisses,
                            salt,
                            id,
                            firstRowClicked,
                            setFirstRowClicked,
                            firstColClicked,
                            setFirstColClicked,
                            startTime,
                            setStartTime,
                            numFlags,
                            setNumFlags,
                            isCtrlPressed,
                            setIsCtrlPressed,
                        ]}
                    >
                        <Minesweeper />
                    </GameContext.Provider>
                );
            } else {
                // game not started, render lobby
                return (
                    <GameContext.Provider
                        value={[setGameStarted, rows, setRows, cols, setCols, mines, setMines, setSalt]}
                    >
                        <Lobby />
                    </GameContext.Provider>
                );
            }
        } else return <div>Game not found. Check url for typo?</div>; // game not found, tell user to retype url
    }
};

export default Page;
