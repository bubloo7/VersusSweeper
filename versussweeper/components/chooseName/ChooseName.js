import { GameContext } from "@/pages/[id]";
import { useState, useContext } from "react";
import { Button, Col, Row, Input } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function ChooseName() {
  // we only load when the user clicks the button and we wait for the call to return
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      tempName: "",
    },
    validationSchema: Yup.object({
      tempName: Yup.string()
        .min(1, "Must be 1 character or more")
        .max(10, "Must be 10 characters or less")
        .matches(
          /^[a-zA-Z0-9]*$/,
          "Only letters and numbers (no spaces or symbols)"
        )
        .required("Required"),
    }),
    onSubmit: (values) => {
      handleNameSelect(values.tempName);
    },
  });

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

  const handleNameSelect = (tempName) => {
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
        <Col xs={22} sm={22} md={20} lg={18} xl={18} xxl={18}>
          <Row justify="center">
            <h1
              className="header-text"
              style={{ color: "var(--main-black)", textAlign: "center" }}
            >
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
          <Row justify="center" align="middle" wrap={true} style={{ marginTop: "75px" }}>
            <Col xs={16} sm={14} md={12} lg={8} xl={8} xxl={8}>
              <Input
                style={{
                  width: "100%",
                  height: "52px",
                  color: "var(--darker-gray)",
                  borderRadius: "0px",
                  borderColor: "var(--darker-gray)",
                  textTransform: "none",
                }}
                className="button-text "
                placeholder="Name"
                value={formik.values.tempName}
                name="tempName"
                type="text"
                onChange={formik.handleChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    formik.handleSubmit();
                  }
                }}
              />
            </Col>
            <Col xs={16} sm={6} md={6} lg={4} xl={4} xxl={4}>
              <Button
                className="black-button"
                style={{
                  backgroundColor:
                    Object.keys(formik.errors).length > 0
                      ? "var(--main-red)"
                      : "var(--main-green)",
                  width: "100%",
                }}
                onClick={formik.handleSubmit}
                type="null"
              >
                Join {id}
              </Button>
            </Col>
          </Row>
          {formik.errors.tempName && (
            <div
              style={{
                color: "var(--main-red)",
                fontSize: "14px",
                fontFamily: "var(--robo-reg)",
                display: "flex",
                justifyContent: "center",
                marginTop: "10px",
              }}
            >
              {formik.errors.tempName}
            </div>
          )}
        </Col>
      </Row>
    );
  }
}
