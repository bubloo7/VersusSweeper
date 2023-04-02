import { GameContext } from "@/pages/[id]";
import { useContext } from "react";
import Image from "next/image";
import Hidden from "../images/hidden.png";
import Zero from "../images/0.png";
import One from "../images/1.png";
import Two from "../images/2.png";
import Three from "../images/3.png";
import Four from "../images/4.png";
import Five from "../images/5.png";
import Six from "../images/6.png";
import Seven from "../images/7.png";
import Eight from "../images/8.png";
import Mine from "../images/mine.png";
import Flag from "../images/flag.png";
import { getBoard, reveal, middleClick, flag } from "../javascript/game";

export default function MinesweeperRow(props) {
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

    return (
        <div
            style={{
                padding: "2px",
            }}
        >
            <Image
                src={(() => {
                    if (revealed[props.rowNum][props.colNum]) {
                        if (board[props.rowNum][props.colNum] === -1) {
                            return Mine;
                        }
                        if (board[props.rowNum][props.colNum] === 0) {
                            return Zero;
                        }
                        if (board[props.rowNum][props.colNum] === 1) {
                            return One;
                        }
                        if (board[props.rowNum][props.colNum] === 2) {
                            return Two;
                        }
                        if (board[props.rowNum][props.colNum] === 3) {
                            return Three;
                        }
                        if (board[props.rowNum][props.colNum] === 4) {
                            return Four;
                        }
                        if (board[props.rowNum][props.colNum] === 5) {
                            return Five;
                        }
                        if (board[props.rowNum][props.colNum] === 6) {
                            return Six;
                        }
                        if (board[props.rowNum][props.colNum] === 7) {
                            return Seven;
                        }
                        if (board[props.rowNum][props.colNum] === 8) {
                            return Eight;
                        }
                    } else {
                        if (flagged[props.rowNum][props.colNum]) {
                            return Flag;
                        } else {
                            return Hidden;
                        }
                    }
                })()}
                alt={(() => {
                    if (revealed[props.rowNum][props.colNum]) {
                        if (board[props.rowNum][props.colNum] === -1) {
                            return "mine";
                        }
                        if (board[props.rowNum][props.colNum] === 0) {
                            return "zero";
                        }
                        if (board[props.rowNum][props.colNum] === 1) {
                            return "one";
                        }
                        if (board[props.rowNum][props.colNum] === 2) {
                            return "two";
                        }
                        if (board[props.rowNum][props.colNum] === 3) {
                            return "three";
                        }
                        if (board[props.rowNum][props.colNum] === 4) {
                            return "four";
                        }
                        if (board[props.rowNum][props.colNum] === 5) {
                            return "five";
                        }
                        if (board[props.rowNum][props.colNum] === 6) {
                            return "six";
                        }
                        if (board[props.rowNum][props.colNum] === 7) {
                            return "seven";
                        }
                        if (board[props.rowNum][props.colNum] === 8) {
                            return "eight";
                        }
                    } else {
                        if (flagged[props.rowNum][props.colNum]) {
                            return "flagged square";
                        } else {
                            return "hidden square";
                        }
                    }
                })()}
                width={40}
                onContextMenu={(e) => {
                    e.preventDefault();
                    if (revealed[props.rowNum][props.colNum] || firstColClicked === -1) {
                        return;
                    }
                    const temp_flag = [...flagged];
                    temp_flag[props.rowNum][props.colNum] = !temp_flag[props.rowNum][props.colNum];
                    if (temp_flag[props.rowNum][props.colNum]) {
                        setNumFlags(numFlags + 1);
                    } else {
                        setNumFlags(numFlags - 1);
                    }

                    setFlagged(temp_flag);
                }}
                onClick={() => {
                    if (firstColClicked === -1) {
                        setFirstRowClicked(props.rowNum);
                        setFirstColClicked(props.colNum);
                        return;
                    } else {
                        if (flagged[props.rowNum][props.colNum]) {
                            return;
                        }
                        const temp_flagged = [...flagged];
                        const temp_revealed = [...revealed];
                        const [tempHits, tempMisses] = reveal(
                            props.rowNum,
                            props.colNum,
                            board,
                            temp_revealed,
                            flagged,
                            lastMiss
                        );
                        setRevealed(temp_revealed);
                        setFlagged(temp_flagged);
                        setHits(hits + tempHits);
                        setMisses(misses + tempMisses);
                        setNumFlags(numFlags + tempMisses);
                    }
                }}
                onMouseDown={(e) => {
                    e.preventDefault();
                    if (revealed[props.rowNum][props.colNum]) {
                        const temp_revealed = [...revealed];
                        const temp_flagged = [...flagged];

                        const [tempHits, tempMisses] = middleClick(
                            props.rowNum,
                            props.colNum,
                            board,
                            temp_revealed,
                            flagged,
                            lastMiss
                        );
                        setRevealed(temp_revealed);
                        setFlagged(temp_flagged);

                        setHits(hits + tempHits);
                        setMisses(misses + tempMisses);
                        setNumFlags(numFlags + tempMisses);
                    }
                }}
            />
        </div>
    );
}
