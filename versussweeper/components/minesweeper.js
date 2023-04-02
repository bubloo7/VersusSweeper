import React from "react";
import { getBoard, reveal } from "../javascript/game";
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
    ] = useContext(GameContext);
    const [stunTimer, setStunTimer] = useState(-1);
    const [minesweeperRows, setMinesweeperRows] = useState([]);
    const [time, setTime] = useState(-1);

    // This use effect is called when the first row and col are clicked
    useEffect(() => {
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
        setTime(0);
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
            setLastMiss(Date.now() + 5000 * misses);
            setStunTimer(misses * 5);
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
