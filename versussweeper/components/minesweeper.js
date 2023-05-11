import React from "react";
import { getBoard, reveal } from "../javascript/MinesweeperUtils";
import { GameContext } from "@/pages/[id]";
import { useContext, useEffect, useState } from "react";
import MinesweeperRow from "./MinesweeperRow";
import Leaderboard from "./Leaderboard";
import { set } from "firebase/database";

export default function Minesweeper() {
    const [
        rows,
        cols,
        mines,
        board,
        setBoard,
        revealed,
        setRevealed,
        flagged,
        setFlagged,
        lastMiss, // time till you can click again
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
    ] = useContext(GameContext);
    const [minesweeperRows, setMinesweeperRows] = useState([]);
    const [time, setTime] = useState(-1);

    useEffect(() => {
        if (startTime !== -1) {
            setTime(Math.floor((Date.now() - startTime) / 1000));
        }
    }, [startTime]);

    // This use effect is called when the first row and col are clicked
    useEffect(() => {
        if (firstRowClicked !== -1 && firstColClicked !== -1) {
            const newBoard = getBoard(rows, cols, mines, salt, firstRowClicked, firstColClicked);
            setBoard(newBoard);
            if (!revealed[firstRowClicked][firstColClicked]) {
                let revealStupid = [...revealed];
                revealStupid[firstRowClicked][firstColClicked] = true;
                setRevealed(revealStupid);
                console.log("first click reveal");
                let temp_reveal = [];
                for (let i = 0; i < rows; i++) {
                    temp_reveal.push([]);
                    for (let j = 0; j < cols; j++) {
                        temp_reveal[i].push(false);
                    }
                }
                const [tempHits, tempMisses, revealedIndices] = reveal(
                    firstRowClicked,
                    firstColClicked,
                    newBoard,
                    temp_reveal,
                    flagged,
                    lastMiss
                );

                let tempFinishTime = 1682900908681 * 2;
                if (hits + tempHits === rows * cols - mines) {
                    tempFinishTime = Date.now();
                    console.log("play setting time", tempFinishTime);
                    setPlayers((prevPlayers) => {
                        let temp = { ...prevPlayers };
                        temp[name].finishTime = tempFinishTime;
                        return temp;
                    });
                    setFinishTime(finishTime);
                    setShowNextGame(true);
                }
                setRevealed(temp_reveal);
                setHits(tempHits);
                console.log("test", "first move", tempHits, tempMisses, name);
                socket.emit("revealToServer", {
                    revealedIndices,
                    hits: tempHits,
                    misses: tempMisses,
                    name,
                    finishTime: tempFinishTime,
                });
            }
        }
    }, [firstRowClicked, firstColClicked]);

    // This use effect handles the timer
    useEffect(() => {
        if (time === -1 || hits + mines === rows * cols) {
            return;
        } else {
            const interval = setInterval(() => {
                setTime(time + 1);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [time]);

    // This effect is called at the very beginning
    useEffect(() => {
        const temp = [];
        for (let i = 0; i < rows; i++) {
            temp.push(<MinesweeperRow rowNum={i} key={i} cols={cols} />);
        }
        setMinesweeperRows(temp);
    }, []);

    // This method handles how long you are stunned for
    useEffect(() => {
        if (stunTimer !== -1) {
            const interval = setInterval(() => {
                setStunTimer(stunTimer - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [stunTimer]);

    return (
        <div>
            {minesweeperRows}
            {firstColClicked === -1 && (
                <div>
                    {firstMoveName === name
                        ? "You get to make the first move!"
                        : `Waiting for ${firstMoveName} to make a move...`}
                </div>
            )}
            <div>
                Hits = {hits}
                Misses = {misses}
                Time = {Math.min(Math.max(time, 0), Math.floor((finishTime - startTime) / 1000))}
            </div>
            {hits + mines === rows * cols && <div>You win!</div>}
            <div>Mines left: {mines - numFlags}</div>
            {stunTimer > 0 && <div>Stunned for {stunTimer} seconds</div>}
            {showNextGame && (
                <button
                    onClick={() => {
                        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/joinNextGame`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                difficulty,
                                rows,
                                cols,
                                mines,
                                publicRoom,
                                stunDuration,
                                playerLimit,
                                disableFlag,
                                disableMiddleMouse,
                                id,
                            }),
                        })
                            .then((res) => res.json())
                            .then((res) => {
                                window.location.href = "/" + res.id;
                            });
                    }}
                >
                    Join next game
                </button>
            )}
            <Leaderboard
                hits={hits}
                misses={misses}
                players={players}
                name={name}
                startTime={startTime}
                finishTime={finishTime}
            />
        </div>
    );
}
