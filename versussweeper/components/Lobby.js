import React from "react";
import { useState, useContext } from "react";
import { GameContext } from "@/pages/[id]";
export default function Lobby() {
    const [difficulty, setDifficulty] = useState(0);
    const [setGameStarted, rows, setRows, cols, setCols, mines, setMines, setSalt] = useContext(GameContext);
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
                        setRows(e.target.value);
                        setMines(Math.min(mines, Math.floor(e.target.value * cols * 0.25)));
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
                        setCols(e.target.value);
                        setMines(Math.min(mines, Math.floor(rows * e.target.value * 0.25)));
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
                    onChange={(e) => setMines(e.target.value)}
                ></input>
            </div>
            <button
                style={{
                    width: "100px",
                    height: "50px",
                    fontSize: "20px",
                    backgroundColor: "red",
                }}
                onClick={() => {
                    setGameStarted(true);
                    setSalt(Math.floor(Math.random() * 100000));
                }}
            >
                Start
            </button>
        </div>
    );
}
