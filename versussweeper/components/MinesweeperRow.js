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

  const mHeight =
    props.rows <= 10 && props.cols <= 10
      ? "36px"
      : props.rows <= 16 && props.cols <= 25
      ? "26px"
      : "23px";

  return (
    <Row
      justify="center"
      align="middle"
      style={{
        maxHeight: { mHeight },
      }}
    >
      {MinesweeperSquares}
    </Row>
  );
}
