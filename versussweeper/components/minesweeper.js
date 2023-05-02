import React from "react";
import { getBoard, reveal } from "../javascript/MinesweeperUtils";
import { GameContext } from "@/pages/[id]";
import { useContext, useEffect, useState } from "react";
import MinesweeperRow from "./MinesweeperRow";

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
    ] = useContext(GameContext);
    const [stunTimer, setStunTimer] = useState(-1);
    const [minesweeperRows, setMinesweeperRows] = useState([]);
    const [time, setTime] = useState(-1);

    useEffect(() => {
        if (startTime !== -1) {
            console.log((Date.now() - startTime) / 1000, "time");
            setTime(Math.floor((Date.now() - startTime) / 1000));
        }
    }, [startTime]);

    // This use effect is called when the first row and col are clicked
    useEffect(() => {
        console.log("first row and col clicked", firstRowClicked, firstColClicked);
        if (firstRowClicked !== -1 && firstColClicked !== -1) {
            const newBoard = getBoard(rows, cols, mines, id + salt, firstRowClicked, firstColClicked);
            setBoard(newBoard);
            const temp_reveal = [];
            const temp_flag = [];
            for (let i = 0; i < rows; i++) {
                temp_reveal.push([]);
                temp_flag.push([]);
                for (let j = 0; j < cols; j++) {
                    temp_reveal[i].push(false);
                    temp_flag[i].push(false);
                }
            }
            const [tempHits, tempMisses] = reveal(
                firstRowClicked,
                firstColClicked,
                newBoard,
                temp_reveal,
                temp_flag,
                lastMiss
            );
            setRevealed(temp_reveal);
            setHits(tempHits);
            setMisses(tempMisses);
            setFlagged(temp_flag);
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

    // This effect is called whenever misses is incremented
    useEffect(() => {
        if (misses !== 0) {
            setLastMiss(Date.now() + stunDuration * 1000);
            setStunTimer(stunDuration);
        }
    }, [misses]);

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
                Time = {Math.max(time, 0)}
            </div>
            {hits + mines === rows * cols && <div>You win!</div>}
            <div>Mines left: {mines - numFlags}</div>
            {stunTimer > 0 && <div>Stunned for {stunTimer} seconds</div>}
        </div>
    );
}
