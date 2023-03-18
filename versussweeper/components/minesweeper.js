import React from "react";
import { getBoard, reveal, middleClick, flag } from "../javascript/game";
import { GameContext } from "@/pages/[id]";
import { useContext, useEffect, useState } from "react";
import MinesweeperRow from "./minesweeperRow";

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
    ] = useContext(GameContext);
    const [stunTimer, setStunTimer] = useState(-1);

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

        if (flagged.length === 0) {
            setFlagged(temp_flag);
        }
        if (firstRowClicked !== -1 && firstColClicked !== -1) {
            console.log("time set to 0");
            setTime(0);
        }
    }, [firstRowClicked, firstColClicked]);

    // does not work fsr??????
    // const minesweeperRows = [];
    // useEffect(() => {
    //     for (let i = 0; i < rows; i++) {
    //         minesweeperRows.push(<MinesweeperRow rowNum={i} key={i} />);
    //     }
    // }, []);
    const [time, setTime] = useState(-1);
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

    const [minesweeperRows, setMinesweeperRows] = useState([]);
    useEffect(() => {
        const temp = [];
        for (let i = 0; i < rows; i++) {
            temp.push(<MinesweeperRow rowNum={i} key={i} cols={cols} />);
        }
        setMinesweeperRows(temp);
    }, []);

    useEffect(() => {
        if (misses === 0) {
            return;
        } else {
            setLastMiss(Date.now() + 5000 * misses);
            setStunTimer(misses * 5);
        }
    }, [misses]);

    useEffect(() => {
        if (stunTimer === -1) {
            return;
        } else {
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
            {stunTimer > 0 && <div>Stunned for {stunTimer} seconds</div>}
        </div>
    );
}
