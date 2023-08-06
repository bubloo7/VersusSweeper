import { Button, Col, Row, Space } from "antd";
import Image from "next/image";
import HeroImage from "../images/hero-image.png";
import Image1 from "../images/1-image.png";
import Image2 from "../images/2-image.png";
import Image3 from "../images/3-image.png";
import Image4 from "../images/4-image.png";
import One from "../images/retro/1.png";
import Two from "../images/retro/2.png";
import Three from "../images/retro/3.png";
import Four from "../images/retro/4.png";
import { Input } from "antd";
import { useState } from "react";

import Layout from "../components/Layout";

export default function Home() {
  const [codeEntered, setCodeEntered] = useState("");

  function navigateToCreate() {
    window.location.href = "/create";
  }

  function navigateToGames() {
    window.location.href = "/games";
  }

  return (
    <Layout>
      <Row
        justify="center"
        align="middle"
        style={{
          height: "auto",
          backgroundColor: "var(--background-color)",
          paddingTop: "50px",
        }}
      >
        <Col xs={22} sm={22} md={22} lg={22} xl={20} xxl={20}>
          <Row justify="space-around" align="middle">
            <Col xs={24} sm={18} md={10} lg={10} xl={10} xxl={10}>
              <Image
                src={HeroImage}
                alt="Hero Image"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </Col>
            <Col
              xs={24}
              sm={18}
              md={10}
              lg={10}
              xl={10}
              xxl={10}
              style={{ marginTop: "20px" }}
            >
              <div>
                <h1 style={{ textAlign: "center" }} className="header-text">
                  Modernize a Classic
                </h1>
                <p
                  style={{ textAlign: "center", marginTop: "20px" }}
                  className="body-text"
                >
                  Invite your friends and test your wits in a game of
                  competitive Minesweeper.
                </p>
                <Row
                  justify="space-around"
                  align="middle"
                  style={{ marginTop: "20px" }}
                >
                  <Button
                    type="null"
                    className="black-button"
                    style={{ backgroundColor: "var(--main-red)" }}
                    onClick={navigateToGames}
                  >
                    Find Game
                  </Button>
                  <Button
                    type="null"
                    className="black-button"
                    style={{ backgroundColor: "var(--main-green)" }}
                    onClick={navigateToCreate}
                  >
                    Create Game
                  </Button>
                </Row>

                <p
                  style={{
                    textAlign: "center",
                    color: "var(--darker-gray)",
                    marginTop: "20px",
                  }}
                  className="body-text"
                >
                  Have game code? Enter below:
                </p>

                <Space.Compact
                  style={{
                    margin: "20px auto 0px auto",
                    width: "80%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Input
                    style={{
                      width: "100%",
                      height: "52px",
                      color: "var(--darker-gray)",
                      borderRadius: "0px",
                      borderColor: "var(--darker-gray)",
                      textTransform: "uppercase",
                    }}
                    className="button-text"
                    value={codeEntered}
                    onChange={(e) => setCodeEntered(e.target.value)}
                  />
                  <Button
                    type="null"
                    className="black-button"
                    onClick={() => {
                      window.location.href = `/${codeEntered.toUpperCase()}`;
                    }}
                  >
                    Join Game
                  </Button>
                </Space.Compact>
              </div>
            </Col>
          </Row>

          <Row
            justify="center"
            align="middle"
            wrap={true}
            style={{ marginTop: "200px", marginBottom: "120px" }}
          >
            <Col xs={22} sm={22} md={22} lg={22} xl={20} xxl={20}>
              <Row
                justify="center"
                align="middle"
                style={{ marginBottom: "20px" }}
              >
                <h1 className="subheader-text">How to play</h1>
              </Row>

              <Row justify="space-around" align="middle">
                <Col
                  xs={24}
                  sm={18}
                  md={11}
                  lg={11}
                  xl={10}
                  xxl={10}
                  style={{ marginTop: "20px" }}
                >
                  <Row justify="start" align="middle">
                    <Image
                      src={One}
                      alt="One"
                      style={{
                        maxWidth: "15%",
                        height: "auto",
                        border: "4px solid var(--darker-gray)",
                      }}
                    />
                    <h1
                      className="subheader-text"
                      style={{
                        fontSize: "14px",
                        color: "var(--dark-gray)",
                        paddingLeft: "20px",
                      }}
                    >
                      Create
                    </h1>
                  </Row>
                  <Row
                    justify="start"
                    align="top"
                    style={{
                      backgroundColor: "var(--lighter-gray)",
                      marginTop: "15px",
                      width: "100%",
                      height: "250px",
                    }}
                  >
                    <p
                      className="body-text"
                      style={{
                        color: "var(--darker-gray)",
                        textAlign: "start",
                        padding: "15px 0px 0px 15px",
                        maxWidth: "55%",
                      }}
                    >
                      Create a game with the level of difficulty you want.
                      Choose from Easy, Medium, Hard, or create your own custom
                      board.
                    </p>
                    <Image
                      src={Image1}
                      alt="Create Image"
                      style={{
                        maxWidth: "50%",
                        height: "auto",
                        position: "absolute",
                        bottom: "0",
                        right: "5px",
                      }}
                    />
                  </Row>
                </Col>
                <Col
                  xs={24}
                  sm={18}
                  md={11}
                  lg={11}
                  xl={10}
                  xxl={10}
                  style={{ marginTop: "20px" }}
                >
                  <Row justify="start" align="middle">
                    <Image
                      src={Two}
                      alt="Two"
                      style={{
                        maxWidth: "15%",
                        height: "auto",
                        border: "4px solid var(--darker-gray)",
                      }}
                    />
                    <h1
                      className="subheader-text"
                      style={{
                        fontSize: "14px",
                        color: "var(--dark-gray)",
                        paddingLeft: "20px",
                      }}
                    >
                      Set Up
                    </h1>
                  </Row>
                  <Row
                    justify="start"
                    align="top"
                    style={{
                      backgroundColor: "var(--lighter-gray)",
                      marginTop: "15px",
                      width: "100%",
                      height: "250px",
                    }}
                  >
                    <p
                      className="body-text"
                      style={{
                        color: "var(--darker-gray)",
                        textAlign: "start",
                        padding: "15px 0px 0px 15px",
                        maxWidth: "55%",
                      }}
                    >
                      Set the dimensions, mines, stun time, player limit, and
                      more. The game is yours to customize and enjoy.
                    </p>
                    <Image
                      src={Image2}
                      alt="Set Up Image"
                      style={{
                        maxWidth: "35%",
                        height: "auto",
                        position: "absolute",
                        bottom: "40px",
                        right: "5px",
                      }}
                    />
                  </Row>
                </Col>
              </Row>

              <Row justify="space-around" align="middle">
                <Col
                  xs={24}
                  sm={18}
                  md={11}
                  lg={11}
                  xl={10}
                  xxl={10}
                  style={{ marginTop: "20px" }}
                >
                  <Row justify="start" align="middle">
                    <Image
                      src={Three}
                      alt="Three"
                      style={{
                        maxWidth: "15%",
                        height: "auto",
                        border: "4px solid var(--darker-gray)",
                      }}
                    />
                    <h1
                      className="subheader-text"
                      style={{
                        fontSize: "14px",
                        color: "var(--dark-gray)",
                        paddingLeft: "20px",
                      }}
                    >
                      Invite
                    </h1>
                  </Row>
                  <Row
                    justify="end"
                    align="top"
                    style={{
                      backgroundColor: "var(--lighter-gray)",
                      marginTop: "15px",
                      width: "100%",
                      height: "250px",
                    }}
                  >
                    <Image
                      src={Image3}
                      alt="Invite Image"
                      style={{
                        maxWidth: "55%",
                        height: "auto",
                        position: "absolute",
                        bottom: "5px",
                        left: "5px",
                      }}
                    />
                    <p
                      className="body-text"
                      style={{
                        color: "var(--darker-gray)",
                        textAlign: "end",
                        padding: "15px 15px 0px 0px",
                        marginBottom: "auto",
                        maxWidth: "55%",
                      }}
                    >
                      Once the game is set, invite your friends using the game
                      code and start playing! Track the lobby and look over the
                      game settings before starting.
                    </p>
                  </Row>
                </Col>
                <Col
                  xs={24}
                  sm={18}
                  md={11}
                  lg={11}
                  xl={10}
                  xxl={10}
                  style={{ marginTop: "20px" }}
                >
                  <Row justify="start" align="middle">
                    <Image
                      src={Four}
                      alt="Four"
                      style={{
                        maxWidth: "15%",
                        height: "auto",
                        border: "4px solid var(--darker-gray)",
                      }}
                    />
                    <h1
                      className="subheader-text"
                      style={{
                        fontSize: "14px",
                        color: "var(--dark-gray)",
                        paddingLeft: "20px",
                      }}
                    >
                      Enjoy
                    </h1>
                  </Row>
                  <Row
                    justify="start"
                    align="top"
                    style={{
                      backgroundColor: "var(--lighter-gray)",
                      marginTop: "15px",
                      width: "100%",
                      height: "250px",
                    }}
                  >
                    <p
                      className="body-text"
                      style={{
                        color: "var(--darker-gray)",
                        textAlign: "start",
                        padding: "15px 0px 0px 15px",
                        maxWidth: "55%",
                      }}
                    >
                      Finally, enjoy the game! The first player to clear their
                      board wins. Once finished, join the next game and play
                      again!
                    </p>
                    <Image
                      src={Image4}
                      alt="Enjoy Image"
                      style={{
                        maxWidth: "55%",
                        height: "auto",
                        position: "absolute",
                        bottom: "5px",
                        right: "5px",
                      }}
                    />
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </Layout>
  );
}
