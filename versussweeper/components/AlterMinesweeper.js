import React from "react";
import { getBoard, reveal } from "../javascript/MinesweeperUtils";
import { GameContext } from "@/pages/[id]";
import { useContext, useEffect, useState } from "react";
import MinesweeperRow from "./MinesweeperRow";
import Leaderboard from "./Leaderboard";
import { Row, Col, Button, notification } from "antd";
import Icon, {
  FieldTimeOutlined,
  CloseSquareOutlined,
  AimOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import styles from "./Minesweeper.module.css";

const BombSvg = () => (
  <svg width="1em" height="1em" viewBox="0 0 442 442" fill="none">
    <path
      d="M67.9004 374.133V340.1H101.934V374.133H67.9004ZM340 374.133V340.1H373.867V374.133H340ZM203.867 204.133V136.066H135.967V204.133H203.867ZM67.9004 102.033V68H101.934V102.033H67.9004ZM340 102.033V68H373.867V102.033H340ZM203.867 441.867V374.133H135.967V340.1H101.934V306.066H67.9004V238H0V204.133H67.9004V136.066H101.934V102.033H135.967V68H203.867V0.0996094H237.9V68H305.967V102.033H340V136.066H373.867V204.133H441.934V238H373.867V306.066H340V340.1H305.967V374.133H237.9V441.867H203.867Z"
      fill="#1A1A1A"
    />
  </svg>
);

const BombIcon = (props) => <Icon component={BombSvg} {...props} />;

export default function AlterMinesweeper() {
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

  const [api, contextHolder] = notification.useNotification();
  const openWelcomeNotification = () => {
    api.info({
      message: "Welcome to Versus Sweeper!",
      description:
        "Clear the board first to win! Watch out for mine stun traps!",
      placement: "topRight",
      duration: 5,
      icon: <BombIcon />,
      style: {
        backgroundColor: "var(--background-color)",
        color: "var(--main-black)",
        border: "2px solid var(--main-black)",
        borderRadius: "0px",
      },

      onClose: () => {
        openControlsNotification();
      },
    });
  };

  const openControlsNotification = () => {
    api.info({
      message: "Controls",
      description: (
        <>
          Left click to reveal a tile.
          <br />
          Right click to flag a tile.
          <br />
          Middle click to reveal all adjacent tiles.
        </>
      ),
      placement: "topRight",
      duration: 5,
      style: {
        backgroundColor: "var(--background-color)",
        color: "var(--main-black)",
        border: "2px solid var(--main-black)",
        borderRadius: "0px",
      },
      icon: <InfoCircleOutlined color="var(--main-black)"/>,
    });
  };

  useEffect(() => {
    openWelcomeNotification();
  }, []);

  useEffect(() => {
    // old timer approach
    // if (startTime !== -1) {
    //     setTime(Math.floor((Date.now() - startTime) / 1000));
    // }
    // new timer approach
    if (startTime !== -1) {
      const interval = setInterval(() => {
        setTime(Math.floor((Date.now() - startTime) / 1000));
      }, 500);
      return () => {
        clearInterval(interval);
      };
    }
  }, [startTime]);

  useEffect(() => {
    if (lastMiss > Date.now()) {
      const interval = setInterval(() => {
        if (lastMiss <= Date.now()) {
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
      const newBoard = getBoard(
        rows,
        cols,
        mines,
        salt,
        firstRowClicked,
        firstColClicked
      );
      setBoard(newBoard);
      if (!revealed[firstRowClicked][firstColClicked]) {
        let revealStupid = [...revealed];
        revealStupid[firstRowClicked][firstColClicked] = true;
        setRevealed(revealStupid);
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

  // }, [time]);

  // This effect is called at the very beginning
  useEffect(() => {
    const temp = [];
    for (let i = 0; i < rows; i++) {
      temp.push(<MinesweeperRow rowNum={i} key={i} cols={cols} rows={rows} />);
    }
    setMinesweeperRows(temp);
  }, []);

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
      const stepDuration = 10; // Duration for each animation step in milliseconds
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
      {contextHolder}

      <Row
        justify="center"
        align="start"
        style={{ marginTop: "30px", marginBottom: "50px" }}
      >
        <Col>
          <div
            style={{
              border: "5px ridge var(--light-gray)",
              borderStyle: "ridge",
              maxWidth: "100%",
              overflowX: "auto",
              margin: "20px 10px 0px 10px",
            }}
          >
            {minesweeperRows}
          </div>
        </Col>
        <Col xs={22} sm={22} md={14} lg={10} xl={8} xxl={8}>
          <Row
            justify="center"
            align="start"
            style={{ margin: "20px 10px 0px 10px"}}
          >
            {firstColClicked === -1 && (
              <Row
                justify="center"
                align="start"
                style={{
                  textAlign: "center",
                  marginBottom: "20px",
                }}
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
                align="start"
                style={{
                  textAlign: "center",
                  color: "var(--main-red)",
                  marginBottom: "20px",
                }}
                className="button-text"
              >
                Stunned for {stunTimer} seconds!
              </Row>
            )}

            <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={24}
              xxl={24}
              style={{
                backgroundColor: "var(--light-gray)",
                margin: "0px 10px 0px 10px",
                padding: "0px 20px 20px 20px",
              }}
            >
              <Row
                justify="space-between"
                align="middle"
                style={{ marginTop: "10px" }}
              >
                <h3 className="button-text" style={{ textAlign: "center" }}>
                  <FieldTimeOutlined />
                  {"  "}Time (S):
                </h3>
                <Row
                  style={{ marginLeft: "5px", color: "var(--main-black)" }}
                  className={styles.inputBox}
                >
                  {Math.max(time, 0)}
                </Row>
              </Row>
              <Row
                justify="space-between"
                align="middle"
                style={{ marginTop: "10px" }}
              >
                <h3 className="button-text" style={{ textAlign: "center" }}>
                  <BombIcon />
                  {"  "}Mines Left:
                </h3>
                <Row
                  style={{ marginLeft: "5px", color: "var(--main-black)" }}
                  className={styles.inputBox}
                >
                  {mines - numFlags}
                </Row>
              </Row>
            </Col>

            <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={24}
              xxl={24}
              style={{
                backgroundColor: "var(--light-gray)",
                margin: "0px 10px 0px 10px",
                padding: "0px 10px 20px 10px",
              }}
            >
              <h2
                className="subsubheader-text"
                style={{ textAlign: "center", marginTop: "10px" }}
              >
                Ranks
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
        </Col>
      </Row>

      {hits + mines === rows * cols && (
        <Row
          justify="center"
          align="middle"
          className="button-text"
          style={{ marginTop: "20px", textAlign: "center" }}
        >
          <p>You completed the game, check out the leaderboard!</p>
        </Row>
      )}

      {showNextGame && (
        <Row
          justify="center"
          align="middle"
          style={{ marginTop: "20px", marginBottom: "20px" }}
        >
          <Button
            className="black-button"
            onClick={joinNextGame}
            style={{ backgroundColor: "var(--main-green)" }}
            type="null"
          >
            Join Next Game
          </Button>
        </Row>
      )}
    </>
  );
}
