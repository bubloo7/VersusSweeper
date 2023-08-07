import React from "react";
import { getBoard, reveal } from "../javascript/MinesweeperUtils";
import { GameContext } from "@/pages/[id]";
import { useContext, useEffect, useState } from "react";
import MinesweeperRow from "./MinesweeperRow";
import Leaderboard from "./Leaderboard";
import { Row, Col, Button } from "antd";
import { FieldTimeOutlined, CloseSquareOutlined, AimOutlined } from "@ant-design/icons";
import styles from "./Minesweeper.module.css";

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
        // old timer approach
        // if (startTime !== -1) {
        //     setTime(Math.floor((Date.now() - startTime) / 1000));
        // }
        // new timer approach
        if (startTime !== -1) {
            console.log("setting interval in startTime");
            const interval = setInterval(() => {
                console.log("interval!! in startTime");
                setTime(Math.floor((Date.now() - startTime) / 1000));
            }, 500);
            return () => {
                console.log("clearing interval in startTime");
                clearInterval(interval);
            };
        }
    }, [startTime]);

    useEffect(() => {
        if (lastMiss > Date.now()) {
            console.log("setting interval in lastMiss");
            const interval = setInterval(() => {
                console.log("interval!! in lastMiss");
                if (lastMiss <= Date.now()) {
                    console.log("smart clear of interval in lastMiss");
                    clearInterval(interval);
                }
                setStunTimer(Math.ceil((lastMiss - Date.now()) / 1000));
            }, 500);
            return () => {
                clearInterval(interval);
            };
        }
    }, [lastMiss]);

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
    // useEffect(() => {
    //     if (time === -1 || hits + mines === rows * cols) {
    //         return;
    //     } else {
    //         console.log("setting interval");
    //         const interval = setInterval(() => {
    //             console.log("interval!!");

    //             setTime(time + 1);
    //         }, 1000);

    //         return () => {
    //             console.log("clearing interval");
    //             clearInterval(interval);
    //         };
    //     }
    // }, [time]);

    // This effect is called at the very beginning
    useEffect(() => {
        const temp = [];
        for (let i = 0; i < rows; i++) {
            temp.push(<MinesweeperRow rowNum={i} key={i} cols={cols} rows={rows} />);
        }
        setMinesweeperRows(temp);
    }, []);

    // // This method handles how long you are stunned for
    // useEffect(() => {
    //     if (stunTimer !== -1) {
    //         const interval = setInterval(() => {
    //             setStunTimer(stunTimer - 1);
    //         }, 1000);
    //         return () => clearInterval(interval);
    //     }
    // }, [stunTimer]);

    const joinNextGame = () => {
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
    };

    useEffect(() => {
        if (hits + mines === rows * cols) {
            const targetY = document.body.scrollHeight;
            const stepDuration = 15; // Duration for each animation step in milliseconds
            const scrollStep = targetY / (500 / stepDuration); // Adjust 500 to control the smoothness

            let scrollY = 0;

            const scrollAnimation = () => {
                scrollY += scrollStep;
                if (scrollY >= targetY) {
                    window.scrollTo(0, targetY);
                    return;
                }

                window.scrollTo(0, scrollY);
                requestAnimationFrame(scrollAnimation);
            };

            requestAnimationFrame(scrollAnimation);
        }
    }, [hits, mines]);

    return (
        <>
            <Row justify="center" align="middle" style={{ marginTop: "60px" }}>
                <div
                    style={{
                        border: "5px ridge var(--light-gray)",
                        borderStyle: "ridge",
                        maxWidth: "100%",
                    }}
                >
                    {minesweeperRows}
                </div>
            </Row>

            {firstColClicked === -1 && (
                <Row
                    justify="center"
                    align="middle"
                    style={{ marginTop: "20px", textAlign: "center" }}
                    className="button-text"
                >
                    {firstMoveName === name
                        ? "You get to make the first move!"
                        : `Waiting for ${firstMoveName} to make a move...`}
                </Row>
            )}

            {stunTimer > 0 && (
                <Row
                    justify="center"
                    align="middle"
                    style={{
                        marginTop: "20px",
                        textAlign: "center",
                        color: "var(--main-red)",
                    }}
                    className="button-text"
                >
                    Stunned for {stunTimer} seconds!
                </Row>
            )}

            <Row justify="center" align="middle" style={{ marginTop: "60px" }}>
                <Col span={16}>
                    <Row>
                        <Col
                            flex={2}
                            style={{
                                backgroundColor: "var(--light-gray)",
                                margin: "0px 10px 0px 10px",
                                padding: "0px 20px 20px 20px",
                            }}
                        >
                            <h2
                                className="subheader-text"
                                style={{
                                    color: "var(--main-green)",
                                    textAlign: "center",
                                    marginTop: "20px",
                                }}
                            >
                                Your Stats
                            </h2>

                            <Row justify="space-between" align="middle" style={{ marginTop: "24px" }}>
                                <h3 className="button-text" style={{ textAlign: "center" }}>
                                    <AimOutlined />
                                    {"  "}Hits:
                                </h3>
                                <Row className={styles.inputBox}>{hits}</Row>
                            </Row>
                            <Row justify="space-between" align="middle" style={{ marginTop: "10px" }}>
                                <h3 className="button-text" style={{ textAlign: "start" }}>
                                    <CloseSquareOutlined />
                                    {"  "}Misses:
                                </h3>
                                <Row style={{ marginLeft: "5px" }} className={styles.inputBox}>
                                    {misses}
                                </Row>
                            </Row>
                            <Row justify="space-between" align="middle" style={{ marginTop: "10px" }}>
                                <h3 className="button-text" style={{ textAlign: "start" }}>
                                    <FieldTimeOutlined />
                                    {"  "}Time (S):
                                </h3>
                                <Row style={{ marginLeft: "5px" }} className={styles.inputBox}>
                                    {Math.max(time, 0)}
                                </Row>
                            </Row>
                            <Row justify="space-between" align="middle" style={{ marginTop: "10px" }}>
                                <h3 className="button-text" style={{ textAlign: "start" }}>
                                    Mines Left:
                                </h3>
                                <Row style={{ marginLeft: "5px" }} className={styles.inputBox}>
                                    {mines - numFlags}
                                </Row>
                            </Row>
                        </Col>

                        <Col
                            flex={4}
                            style={{
                                backgroundColor: "var(--light-gray)",
                                margin: "0px 10px 0px 10px",
                                padding: "0px 10px 20px 10px",
                            }}
                        >
                            <h2 className="subheader-text" style={{ textAlign: "center", marginTop: "20px" }}>
                                Leaderboard
                            </h2>
                            <Leaderboard
                                hits={hits}
                                misses={misses}
                                players={players}
                                name={name}
                                startTime={startTime}
                                finishTime={finishTime}
                            />
                        </Col>
                    </Row>

                    <Row justify="center" align="middle" className="button-text" style={{ marginTop: "60px" }}>
                        {hits + mines === rows * cols && <p>You completed the game, check out the leaderboard!</p>}
                    </Row>

                    {showNextGame && (
                        <Row justify="center" align="middle" style={{ marginTop: "20px", marginBottom: "20px" }}>
                            <Button
                                className="black-button"
                                onClick={joinNextGame}
                                style={{ backgroundColor: "var(--main-green)" }}
                            >
                                Join Next Game
                            </Button>
                        </Row>
                    )}
                </Col>
            </Row>
        </>
    );
}
