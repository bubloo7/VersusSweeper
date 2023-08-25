import { Row } from "antd";
import MinesweeperSquare from "./MinesweeperSquare";
import { useState, useEffect } from "react";

export default function MinesweeperRow(props) {
  const [MinesweeperSquares, setMinesweeperSquares] = useState([]);
  useEffect(() => {
    const temp = [];
    for (let i = 0; i < props.cols; i++) {
      temp.push(
        <MinesweeperSquare
          rowNum={props.rowNum}
          colNum={i}
          key={i}
          rows={props.rows}
          cols={props.cols}
        />
      );
    }
    setMinesweeperSquares(temp);
  }, []);

  return (
    <Row
      justify="center"
      align="middle"
      wrap={false}
    >
      {MinesweeperSquares}
    </Row>
  );
}
