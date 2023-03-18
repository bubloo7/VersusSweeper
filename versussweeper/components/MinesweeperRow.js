import MinesweeperSquare from "./MinesweeperSquare";
import { useState, useEffect } from "react";

export default function MinesweeperRow(props) {
    const [MinesweeperSquares, setMinesweeperSquares] = useState([]);
    useEffect(() => {
        const temp = [];
        for (let i = 0; i < props.cols; i++) {
            temp.push(<MinesweeperSquare rowNum={props.rowNum} colNum={i} key={i} />);
        }
        setMinesweeperSquares(temp);
    }, []);

    return <div
        style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
        }}
    >{MinesweeperSquares}</div>;
}
