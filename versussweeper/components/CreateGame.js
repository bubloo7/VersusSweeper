import React from "react";
import { useState } from "react";
export default function CreateGame() {
    const [difficulty, setDifficulty] = useState(0);

    const [rows, setRows] = useState(9);
    const [cols, setCols] = useState(9);
    const [mines, setMines] = useState(10);
    const [stunDuration, setStunDuration] = useState(5);
    const [playerLimit, setPlayerLimit] = useState(8);
    const [disableFlag, setDisableFlag] = useState(false);
    const [disableMiddleMouse, setDisableMiddleMouse] = useState(false);
    const [seed, setSeed] = useState("");
    const [publicRoom, setPublicRoom] = useState(true);

    return (
        <div>
            <h2>Choose difficulty</h2>

            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "400px",
                }}
            >
                <button
                    style={{
                        backgroundColor: difficulty === 0 ? "green" : "white",
                        color: difficulty === 0 ? "white" : "black",
                        fontWeight: difficulty === 0 ? "bold" : "normal",
                        width: "100px",
                        height: "50px",
                        fontSize: "20px",
                    }}
                    onClick={() => {
                        setDifficulty(0);
                        setRows(9);
                        setCols(9);
                        setMines(10);
                    }}
                >
                    Easy
                </button>
                <button
                    style={{
                        backgroundColor: difficulty === 1 ? "green" : "white",
                        color: difficulty === 1 ? "white" : "black",
                        fontWeight: difficulty === 1 ? "bold" : "normal",
                        width: "100px",
                        height: "50px",
                        fontSize: "20px",
                    }}
                    onClick={() => {
                        setRows(16);
                        setCols(16);
                        setMines(40);
                        setDifficulty(1);
                    }}
                >
                    Medium
                </button>
                <button
                    style={{
                        backgroundColor: difficulty === 2 ? "green" : "white",
                        color: difficulty === 2 ? "white" : "black",
                        fontWeight: difficulty === 2 ? "bold" : "normal",
                        width: "100px",
                        height: "50px",
                        fontSize: "20px",
                    }}
                    onClick={() => {
                        setRows(16);
                        setCols(30);
                        setMines(99);
                        setDifficulty(2);
                    }}
                >
                    Hard
                </button>

                <button
                    style={{
                        backgroundColor: difficulty === 3 ? "green" : "white",
                        color: difficulty === 3 ? "white" : "black",
                        fontWeight: difficulty === 3 ? "bold" : "normal",
                        width: "100px",
                        height: "50px",
                        fontSize: "20px",
                    }}
                    onClick={() => setDifficulty(3)}
                >
                    Custom
                </button>
            </div>
            {difficulty === 3 && <div>5-20 rows, 5-40 columns, 0-25% mines</div>}
            <div>
                rows:
                <input
                    disabled={difficulty !== 3}
                    type={"number"}
                    value={rows}
                    min={5}
                    max={20}
                    onChange={(e) => {
                        setRows(parseInt(e.target.value));
                    }}
                ></input>
            </div>
            <div>
                cols:
                <input
                    disabled={difficulty !== 3}
                    type={"number"}
                    value={cols}
                    min={5}
                    max={40}
                    onChange={(e) => {
                        setCols(parseInt(e.target.value));
                    }}
                ></input>
            </div>
            <div>
                mines:
                <input
                    disabled={difficulty !== 3}
                    type={"number"}
                    value={mines}
                    min={0}
                    max={Math.floor(rows * cols * 0.25)}
                    onChange={(e) => {
                        setMines(parseInt(e.target.value));
                    }}
                ></input>
            </div>
            <div>
                Set stun duration (in seconds):
                <input
                    value={stunDuration}
                    type={"number"}
                    min={0}
                    max={60}
                    onChange={(e) => {
                        setStunDuration(parseInt(e.target.value));
                    }}
                ></input>
            </div>
            <div>
                Set max number of players:
                <input
                    value={playerLimit}
                    type={"number"}
                    min={0}
                    max={10}
                    onChange={(e) => {
                        setPlayerLimit(parseInt(e.target.value));
                    }}
                ></input>
            </div>
            <div>
                Disable Flag
                <input
                    type={"checkbox"}
                    checked={disableFlag}
                    onChange={(e) => {
                        setDisableFlag(e.target.checked);
                        if (e.target.checked) {
                            setDisableMiddleMouse(true);
                        }
                    }}
                ></input>
                Disable Middle Mouse
                <input
                    type={"checkbox"}
                    checked={disableMiddleMouse}
                    onChange={(e) => {
                        setDisableMiddleMouse(e.target.checked);
                    }}
                    disabled={disableFlag}
                ></input>
            </div>
            <div>
                Set Seed:
                <input
                    type={"number"}
                    onChange={(e) => {
                        setSeed(e.target.value);
                    }}
                ></input>
            </div>
            <div>
                <button
                    style={{
                        width: "100px",
                        height: "50px",
                        fontSize: "20px",
                        backgroundColor: publicRoom ? "green" : "white",
                        color: publicRoom ? "white" : "black",
                        fontWeight: publicRoom ? "bold" : "normal",
                    }}
                    onClick={() => {
                        setPublicRoom(true);
                    }}
                >
                    Public
                </button>
                <button
                    style={{
                        width: "100px",
                        height: "50px",
                        fontSize: "20px",
                        backgroundColor: publicRoom ? "white" : "green",
                        color: publicRoom ? "black" : "white",
                        fontWeight: publicRoom ? "normal" : "bold",
                    }}
                    onClick={() => {
                        setPublicRoom(false);
                    }}
                >
                    Private
                </button>
            </div>
            <button
                style={{
                    width: "100px",
                    height: "50px",
                    fontSize: "20px",
                    backgroundColor: "red",
                }}
                onClick={() => {
                    if (rows < 5) {
                        alert("rows must be at least 5");
                        return;
                    }
                    if (rows > 20) {
                        alert("rows must be at most 20");
                        return;
                    }
                    if (cols < 5) {
                        alert("cols must be at least 5");
                        return;
                    }
                    if (cols > 40) {
                        alert("cols must be at most 40");
                        return;
                    }

                    if (mines < 0) {
                        alert("mines must be at least 0");
                        return;
                    }
                    if (mines > Math.floor(rows * cols * 0.25)) {
                        alert("mines must be at most 25% of the board");
                        return;
                    }

                    const apiCall = {
                        difficulty,
                        rows,
                        cols,
                        mines,
                        stunDuration,
                        playerLimit,
                        disableFlag,
                        disableMiddleMouse,
                        seed,
                        publicRoom,
                    };
                    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(apiCall),
                    })
                        .then((res) => res.json())
                        .then((res) => {
                            // redirect to room
                            console.log(res, "res");
                            window.location.href = "/" + res.id;
                        });
                }}
            >
                Create Room
            </button>
        </div>
    );
}
