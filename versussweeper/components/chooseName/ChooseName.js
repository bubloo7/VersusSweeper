import { GameContext } from "@/pages/[id]";
import { useState, useContext } from "react";
import { Button, Col, Row, Space, Input } from "antd";

export default function ChooseName() {
  const [tempName, setTempName] = useState("");
  // we only load when the user clicks the button and we wait for the call to return
  const [loading, setLoading] = useState(false);

  const [
    id,
    setDifficulty,
    setRows,
    setCols,
    setMines,
    setPublicRoom,
    setStunDuration,
    setPlayerLimit,
    setDisableFlag,
    setDisableMiddleMouse,
    setSeed,
    setSeedRandomlyGenerated,
    setNextGameId,
    setGameStarted,
    setStartTime,
    setHostName,
    setFirstMoveName,
    setFirstColClicked,
    setFirstRowClicked,
    setPlayers,
    setClears,
    setMisses,
    setFinishTime,
    setFlags,
    setStun,
    setRevealed,
    setFlagged,
    setName,
    setGameFull,
    socket,
    stunTimer,
    setStunTimer,
    setShowNextGame,
  ] = useContext(GameContext);

  const handleNameSelect = () => {
    if (tempName.length === 0) {
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        name: tempName,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.gameData === null) {
          setGameFull(true);
          setName(tempName);
          return;
        }

        setDifficulty(data.gameData.difficulty);
        setRows(data.gameData.rows);
        setCols(data.gameData.cols);
        setMines(data.gameData.mines);
        setPublicRoom(data.gameData.publicRoom);
        setStunDuration(data.gameData.stunDuration);
        setPlayerLimit(data.gameData.playerLimit);
        setDisableFlag(data.gameData.disableFlag);
        setDisableMiddleMouse(data.gameData.disableMiddleMouse);
        setSeed(data.gameData.seed);
        setSeedRandomlyGenerated(data.gameData.seedRandomlyGenerated);
        setNextGameId(data.gameData.nextGameId);
        setGameStarted(data.gameData.gameStarted);
        setStartTime(data.gameData.startTime);
        setHostName(data.gameData.hostName);
        setFirstMoveName(data.gameData.firstMoveName);
        setFirstColClicked(data.gameData.firstColClicked);
        setFirstRowClicked(data.gameData.firstRowClicked);
        setPlayers(data.gameData.players);

        for (const key in data.gameData.players) {
          console.log(data.gameData.players[key].finishTime, "help meee");
          if (data.gameData.players[key].finishTime !== 1682900908681 * 2) {
            setShowNextGame(true);
            break;
          }
        }

        setClears(data.gameData.players[tempName].clears);
        setMisses(data.gameData.players[tempName].misses);
        setFinishTime(data.gameData.players[tempName].finishTime);

        setFlags(data.playerObj.flags);
        setStun(data.playerObj.stun);
        setRevealed(data.playerObj.revealed);
        setFlagged(data.playerObj.flagged);
        // setFinishTime(data.playerObj.finishTime);

        if (data.playerObj.stun > Date.now()) {
          setStunTimer(Math.floor((data.playerObj.stun - Date.now()) / 1000));
        }

        if (!data.playerAlreadyInGame) {
          socket.emit("newPlayer", { name: tempName });
        }

        setName(tempName);
      });
  };

  if (loading) {
    return <div> Loading change name... </div>;
  } else {
    return (
      <Row
        wrap={false}
        justify="center"
        align="middle"
        style={{
          height: "100vh",
          backgroundColor: "var(--background-color)",
        }}
      >
        <Col span={24}>
          <Row justify="center">
            <h1 className="header-text" style={{ color: "var(--main-black)" }}>
              Ready to join?
            </h1>
          </Row>
          <Row justify="center">
            <p
              className="body-text"
              style={{
                color: "var(--main-black)",
                textAlign: "center",
                marginTop: "20px",
              }}
            >
              The game is set and your <br /> opponents await you!
            </p>
          </Row>
          <Row justify="center">
            <Space.Compact style={{ marginTop: "75px" }}>
              <Input
                style={{
                  width: "310px",
                  height: "58px",
                  color: "var(--darker-gray)",
                  borderRadius: "0px",
                  borderColor: "var(--darker-gray)",
                  textTransform: "none",
                }}
                className="button-text "
                placeholder="Name"
                value={tempName}
                onChange={(e) => {
                  setTempName(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleNameSelect();
                  }
                }}
              />
              <Button
                className="black-button"
                style={{ backgroundColor: "var(--main-green)" }}
                onClick={handleNameSelect}
                type="null"
              >
                Join {id}
              </Button>
            </Space.Compact>
          </Row>
        </Col>
      </Row>
    );
  }
}
