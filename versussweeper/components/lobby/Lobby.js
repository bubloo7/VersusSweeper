import { GameContext } from "@/pages/[id]";
import { useState, useContext, useEffect } from "react";
import Loading from "../Loading";
import { Row, Col, Space, Button } from "antd";
import {
  LinkOutlined,
  CheckSquareFilled,
  BorderOutlined,
  CheckSquareOutlined,
} from "@ant-design/icons";
import styles from "./Lobby.module.css";

export default function Lobby() {
  const [sDifficulty, setSDifficulty] = useState("");
  const [urlCopied, setUrlCopied] = useState(false);
  const [loading, setLoading] = useState(false); // will be loading after clicking start game

  const [
    id,
    name,
    difficulty,
    rows,
    cols,
    mines,
    publicRoom,
    stunDuration,
    playerLimit,
    disableFlag,
    disableMiddleMouse,
    seed,
    seedRandomlyGenerated,
    setGameStarted,
    setStartTime,
    hostName,
    setFirstMoveName,
    players,
    socket,
  ] = useContext(GameContext);

  const difficultyMap = {
    0: "Easy",
    1: "Medium",
    2: "Hard",
    3: "Custom",
  };

  useEffect(() => {
    setSDifficulty(difficultyMap[difficulty]);
  }, []);

  useEffect(() => {
    if (urlCopied) {
      setTimeout(() => {
        setUrlCopied(false);
      }, 3000);
    }
  }, [urlCopied]);

  const handleUrlCopy = () => {
    setUrlCopied(true);
    navigator.clipboard.writeText(window.location.href);
  };

  const colors = ["var(--main-green)", "var(--main-blue)", "var(--main-red)"];

  const playerNames = Object.keys(players).map((player) => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    return (
      <Row justify="center" key={player}>
        <h1 className="subheader-text" style={{ fontSize: "28px" }}>
          {hostName === player ? "`" : ""}
        </h1>
        <h1
          className="button-text"
          style={{
            color: player === name ? randomColor : "var(--main-black)", 
            fontSize: "28px",
            textAlign: "center",
            marginBottom: "30px",
            textTransform: "none",
          }}
        >
          {player}
        </h1>
      </Row>
    );
  });

  if (loading) {
    return <Loading />;
  } else {
    return (
      <>
        <Row
          wrap={true}
          justify="center"
          align="middle"
          style={{
            backgroundColor: "var(--background-color)",
            paddingTop: "150px",
            paddingBottom: "150px",
          }}
        >
          <Col span={18}>
            <Row justify="center">
              <h1
                className="header-text"
                style={{ color: "var(--main-black)", textAlign: "center" }}
              >
                Game Lobby
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
                Almost there! Invite your friends to this room and <br />
                compete for glory!
              </p>
            </Row>

            <Row justify="center" style={{ marginTop: "50px" }} wrap={true}>
              <Col>
                <Row justify="center" style={{ marginBottom: "10px" }}>
                  <h1
                    className="subheader-text"
                    style={{
                      color: "var(--main-green)",
                      textAlign: "center",
                    }}
                  >
                    {publicRoom ? "Public Room" : "Private Room"}
                  </h1>
                  <h1
                    className="subheader-text"
                    style={{
                      color: "var(--main-black)",
                      textAlign: "center",
                    }}
                  >
                    -
                  </h1>
                  <h1
                    className="subheader-text"
                    style={{
                      color: "var(--darker-gray)",
                      textAlign: "center",
                    }}
                  >
                    {difficultyMap[difficulty]}
                  </h1>
                </Row>
                <Row
                  justify="center"
                  align="middle"
                  onClick={handleUrlCopy}
                  className={styles.copy}
                >
                  <Space size="small">
                    {urlCopied ? (
                      <CheckSquareOutlined
                        style={{
                          fontSize: "24px",
                          color: "var(--main-black)",
                        }}
                      />
                    ) : (
                      <LinkOutlined
                        style={{
                          fontSize: "24px",
                          color: "var(--main-black)",
                        }}
                      />
                    )}
                    <p
                      className="body-text"
                      style={{
                        color: "var(--darker-gray)",
                        textAlign: "center",
                      }}
                    >
                      (TAP TO COPY)
                    </p>
                  </Space>
                </Row>
              </Col>
            </Row>

            <Row justify="center" style={{ marginTop: "50px" }} wrap={true}>
              <Col
                flex={30}
                style={{
                  backgroundColor: "var(--lighter-gray)",
                  padding: "0px 75px 50px 75px",
                }}
              >
                <Row justify="center">
                  <h1
                    className="subheader-text"
                    style={{
                      color: "var(--main-black)",
                      textAlign: "center",
                      marginTop: "20px",
                      marginBottom: "50px",
                    }}
                  >
                    Settings
                  </h1>
                </Row>

                <Row justify="start">
                  <h1
                    style={{ textAlign: "center", marginBottom: "20px" }}
                    className="button-text"
                  >
                    Dimensions:
                  </h1>
                </Row>
                <Row justify="center" style={{ marginBottom: "20px" }}>
                  <Col flex={8}>
                    <Row justify="center" align="middle">
                      <h1
                        className="button-text"
                        style={{ textAlign: "center" }}
                      >
                        Rows:
                      </h1>
                      <Row
                        style={{ marginLeft: "5px" }}
                        className={styles.inputBox}
                      >
                        {rows}
                      </Row>
                    </Row>
                  </Col>
                  <Col flex={8}>
                    <Row justify="center" align="middle">
                      <h1
                        className="button-text"
                        style={{ textAlign: "center" }}
                      >
                        Columns:
                      </h1>
                      <Row
                        style={{ marginLeft: "5px" }}
                        className={styles.inputBox}
                      >
                        {cols}
                      </Row>
                    </Row>
                  </Col>
                </Row>

                <Row>
                  <h1
                    style={{ textAlign: "center", marginBottom: "20px" }}
                    className="button-text"
                  >
                    Number of Mines:
                  </h1>
                </Row>
                <Row justify="center" style={{ marginBottom: "20px" }}>
                  <Col span={13}>
                    <div className={styles.inputBox}>{mines}</div>
                  </Col>
                </Row>

                <Row>
                  <h1
                    style={{ textAlign: "center", marginBottom: "20px" }}
                    className="button-text"
                  >
                    Stun Duration (in Seconds):
                  </h1>
                </Row>
                <Row justify="center" style={{ marginBottom: "40px" }}>
                  <Col span={13}>
                    <div className={styles.inputBox}>{stunDuration}</div>
                  </Col>
                </Row>

                <Row
                  justify="start"
                  align="middle"
                  style={{ marginBottom: "20px" }}
                >
                  <Col span={18}>
                    <h1 className="button-text">Disable Flag:</h1>
                  </Col>
                  <Col span={6}>
                    {disableFlag ? (
                      <CheckSquareFilled
                        style={{
                          fontSize: "24px",
                          color: "var(--darker-gray)",
                        }}
                      />
                    ) : (
                      <BorderOutlined
                        style={{
                          fontSize: "24px",
                          color: "var(--darker-gray)",
                        }}
                      />
                    )}
                  </Col>
                </Row>

                <Row
                  justify="start"
                  align="middle"
                  style={{ marginBottom: "20px" }}
                >
                  <Col span={18}>
                    <h1 className="button-text">Disable Middle Mouse:</h1>
                  </Col>
                  <Col span={6}>
                    {disableMiddleMouse ? (
                      <CheckSquareFilled
                        style={{
                          fontSize: "24px",
                          color: "var(--darker-gray)",
                        }}
                      />
                    ) : (
                      <BorderOutlined
                        style={{
                          fontSize: "24px",
                          color: "var(--darker-gray)",
                        }}
                      />
                    )}
                  </Col>
                </Row>

                <Row
                  justify="start"
                  align="middle"
                  style={{ marginBottom: "20px" }}
                >
                  <Col span={18}>
                    <h1 className="button-text">Seed Randomly Generated:</h1>
                  </Col>
                  <Col span={6}>
                    {seedRandomlyGenerated ? (
                      <CheckSquareFilled
                        style={{
                          fontSize: "24px",
                          color: "var(--darker-gray)",
                        }}
                      />
                    ) : (
                      <BorderOutlined
                        style={{
                          fontSize: "24px",
                          color: "var(--darker-gray)",
                        }}
                      />
                    )}
                  </Col>
                </Row>

                <Row>
                  <h1
                    style={{ marginBottom: "20px" }}
                    className="button-text"
                  >
                    Seed:
                  </h1>
                </Row>
                <Row justify="center">
                  <Col span={13}>
                    <div className={styles.inputBoxSeed}>{seed}</div>
                  </Col>
                </Row>
              </Col>
              <Col
                flex={15}
                style={{
                  backgroundColor: "var(--light-gray)",
                  border: "2px solid var(--darker-gray)",
                }}
              >
                <Row justify="center">
                  <h1
                    className="subheader-text"
                    style={{
                      color: "var(--main-black)",
                      textAlign: "center",
                      marginTop: "20px",
                      marginBottom: "50px",
                    }}
                  >
                    Lobby ({Object.keys(players).length}/{playerLimit})
                  </h1>
                </Row>

                {playerNames}
              </Col>
            </Row>

            <Row justify="center" style={{ marginTop: "50px" }}>
              {hostName === name ? (
                <Button
                  className="black-button"
                  style={{ backgroundColor: "var(--main-green)" }}
                  onClick={() => {
                    // setGameStarted(true);
                    socket.emit("startGameToServer");
                  }}
                >
                  Start Game
                </Button>
              ) : (
                <p className="button-text" style={{ textAlign: "center" }}>
                  Waiting for host to start game...
                </p>
              )}
            </Row>
          </Col>
        </Row>
      </>
    );
  }
}
