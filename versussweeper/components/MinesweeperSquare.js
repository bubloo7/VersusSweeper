import { GameContext } from "@/pages/[id]";
import { useContext } from "react";
import Image from "next/image";

import Hidden from "../images/retro/empty-regular.svg";
import Zero from "../images/retro/0.svg";
import One from "../images/retro/1.svg";
import Two from "../images/retro/2.svg";
import Three from "../images/retro/3.svg";
import Four from "../images/retro/4.svg";
import Five from "../images/retro/5.svg";
import Six from "../images/retro/6.svg";
import Seven from "../images/retro/7.svg";
import Eight from "../images/retro/8.svg";
import Mine from "../images/retro/bomb-hit.svg";
import Flag from "../images/retro/flag.svg";

import { reveal, middleClick } from "../javascript/MinesweeperUtils";

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
  ] = useContext(GameContext);

  const getImage = () => {
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
  };
  const getAlt = () => {
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
  };
  const flag = () => {
    if (
      revealed[props.rowNum][props.colNum] ||
      firstColClicked === -1 ||
      disableFlag
    ) {
      return;
    }
    const temp_flag = [...flagged];
    temp_flag[props.rowNum][props.colNum] =
      !temp_flag[props.rowNum][props.colNum];
    if (temp_flag[props.rowNum][props.colNum]) {
      setNumFlags(numFlags + 1);
    } else {
      setNumFlags(numFlags - 1);
    }

    socket.emit("flagToServer", { name, row: props.rowNum, col: props.colNum });
    setFlagged(temp_flag);
  };

  const handleClick = () => {
    if (firstColClicked === -1) {
      if (name === firstMoveName) {
        // setFirstRowClicked(props.rowNum);
        // setFirstColClicked(props.colNum);
        socket.emit("firstMoveToServer", {
          firstColClicked: props.colNum,
          firstRowClicked: props.rowNum,
        });
      }
    } else {
      if (isCtrlPressed) {
        flag();
        return;
      }
      if (!flagged[props.rowNum][props.colNum]) {
        let temp_revealed = [...revealed];
        const [tempHits, tempMisses, revealedIndices] = reveal(
          props.rowNum,
          props.colNum,
          board,
          temp_revealed,
          flagged,
          lastMiss
        );
        let tempFinishTime = 1682900908681 * 2;
        if (hits + tempHits === rows * cols - mines) {
          tempFinishTime = Date.now();
          setFinishTime(tempFinishTime);
          setShowNextGame(true);
        }

        setRevealed(temp_revealed);
        setHits(hits + tempHits);
        setMisses(misses + tempMisses);
        setNumFlags(numFlags + tempMisses);
        // socket.emit("revealToServer", { revealedIndices, hits: tempHits, misses: tempMisses, name });
        const temp = Date.now() + stunDuration * 1000;

        if (tempMisses > 0) {
          let temp_flagged = [...flagged];
          temp_flagged[props.rowNum][props.colNum] = true;
          setLastMiss(temp);
          setStunTimer(stunDuration);
          // socket.emit("stunToServer", { stun: temp, name, row: props.rowNum, col: props.colNum });
        }
        if (tempHits + tempMisses > 0) {
          socket.emit("revealToServer", {
            revealedIndices,
            hits: tempHits,
            misses: tempMisses,
            name,
            stun: temp,
            finishTime: tempFinishTime,
          });
        }
      }
    }
  };

  const handleMiddleClick = (e) => {
    e.preventDefault();
    if (e.button === 1 && !disableMiddleMouse) {
      if (revealed[props.rowNum][props.colNum]) {
        let temp_revealed = [...revealed];

        const [tempHits, tempMisses, revealedIndices] = middleClick(
          props.rowNum,
          props.colNum,
          board,
          temp_revealed,
          flagged,
          lastMiss
        );
        let tempFinishTime = 1682900908681 * 2;
        if (hits + tempHits === rows * cols - mines) {
          tempFinishTime = Date.now();
          setFinishTime(tempFinishTime);
          setShowNextGame(true);
        }

        setRevealed(temp_revealed);
        setHits(hits + tempHits);
        setMisses(misses + tempMisses);
        setNumFlags(numFlags + tempMisses);
        // socket.emit("revealToServer", { revealedIndices, hits: tempHits, misses: tempMisses, name });
        const temp = Date.now() + stunDuration * 1000;

        if (tempMisses > 0) {
          let temp_flagged = [...flagged];
          const rowNum = revealedIndices[revealedIndices.length - 1][0];
          const colNum = revealedIndices[revealedIndices.length - 1][1];
          temp_flagged[rowNum][colNum] = true;
          setFlagged(temp_flagged);
          setLastMiss(temp);
          setStunTimer(stunDuration);
          // socket.emit("stunToServer", { stun: temp, name, row: rowNum, col: colNum });
        }
        if (tempHits + tempMisses > 0) {
          socket.emit("revealToServer", {
            revealedIndices,
            hits: tempHits,
            misses: tempMisses,
            name,
            stun: temp,
            finishTime: tempFinishTime,
          });
        }
      }
    }
  };

  const width =
    props.rows <= 10 && props.cols <= 10
      ? 20
      : props.rows <= 16 && props.cols <= 25
      ? 18
      : 16;

  return (
    <Image
      src={getImage()}
      alt={getAlt()}
      width={width}
      onContextMenu={(e) => {
        e.preventDefault();
        flag();
      }}
      onClick={handleClick}
      onMouseDown={handleMiddleClick}
    />
  );
}
