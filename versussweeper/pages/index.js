import { Button, Col, Row, Space, Input } from "antd";
import Image from "next/image";
import HeroImage from "../images/hero-image.svg";
import Image1 from "../images/1-image.svg";
import Image2 from "../images/2-image.svg";
import Image3 from "../images/3-image.svg";
import Image4 from "../images/4-image.svg";
import One from "../images/retro/1.svg";
import Two from "../images/retro/2.svg";
import Three from "../images/retro/3.svg";
import Four from "../images/retro/4.svg";
import { useEffect, useState } from "react";

import Layout from "../components/Layout";
import Link from "next/link";

import Loading from "../components/Loading";

export default function Home() {
  const [codeEntered, setCodeEntered] = useState("");
  const [gameExists, setGameExists] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(loadingTimeout);
  }, []);

  useEffect(() => {
    if (gameExists) {
      setTimeout(() => {
        setGameExists(false);
      }, 3000);
    }
  }, [gameExists]);

  function goToGame(code) {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: code,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.exists) {
          window.location.href = `/${code}`;
        } else {
          setGameExists(true);
        }
      });
  }

  if (loading) {
    return <Loading />;
  } else {
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
                  alt="Hero Image Versus Sweeper"
                  width={549}
                  height={381}
                  style={{ maxWidth: "100%", height: "auto" }}
                  priority={true}
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
                    <Link href="/games" passHref>
                      <Button
                        type="null"
                        className="black-button"
                        style={{ backgroundColor: "var(--main-red)" }}
                      >
                        Find Game
                      </Button>
                    </Link>
                    <Link href="/create" passHref>
                      <Button
                        type="null"
                        className="black-button"
                        style={{ backgroundColor: "var(--main-green)" }}
                      >
                        Create Game
                      </Button>
                    </Link>
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
                      onClick={() => goToGame(codeEntered.toUpperCase())}
                    >
                      Join Game
                    </Button>
                  </Space.Compact>

                  {gameExists ? (
                    <p
                      style={{
                        textAlign: "center",
                        color: "var(--main-red)",
                        marginTop: "10px",
                        fontSize: "14px",
                      }}
                      className="body-text"
                    >
                      Game does not exist.
                    </p>
                  ) : null}
                </div>
              </Col>
            </Row>
            <Row
              justify="center"
              align="middle"
              wrap={true}
              style={{ marginTop: "120px", marginBottom: "120px" }}
            >
              <Col xs={22} sm={22} md={22} lg={22} xl={20} xxl={20}>
                <Row
                  justify="center"
                  align="middle"
                  style={{ marginBottom: "20px" }}
                >
                  <h2 className="subheader-text">How to play</h2>
                </Row>

                <Row justify="space-around" align="middle">
                  <Col
                    xs={24}
                    sm={18}
                    md={16}
                    lg={10}
                    xl={10}
                    xxl={10}
                    style={{ marginTop: "20px" }}
                  >
                    <Row justify="start" align="middle">
                      <Image
                        src={One}
                        alt="One"
                        width={100}
                        height={100}
                        style={{
                          maxWidth: "15%",
                          height: "auto",
                          border: "4px solid var(--darker-gray)",
                        }}
                        sizes="100vw"
                      />
                      <h3
                        className="subsubheader-text"
                        style={{
                          color: "var(--dark-gray)",
                          paddingLeft: "20px",
                        }}
                      >
                        Create
                      </h3>
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
                          color: "var(--main-black)",
                          textAlign: "start",
                          padding: "15px 0px 15px 15px",
                          maxWidth: "50%",
                        }}
                      >
                        Create a game with the level of difficulty you want.
                        Choose from Easy, Medium, Hard, or create your own
                        custom board.
                      </p>
                      <Image
                        src={Image1}
                        alt="Create Image"
                        width={290}
                        height={213}
                        style={{
                          maxWidth: "50%",
                          height: "auto",
                          position: "absolute",
                          bottom: "0",
                          right: "5px",
                        }}
                        sizes="100vw"
                      />
                    </Row>
                  </Col>
                  <Col
                    xs={24}
                    sm={18}
                    md={16}
                    lg={10}
                    xl={10}
                    xxl={10}
                    style={{ marginTop: "20px" }}
                  >
                    <Row justify="start" align="middle">
                      <Image
                        src={Two}
                        alt="Two"
                        width={100}
                        height={100}
                        style={{
                          maxWidth: "15%",
                          height: "auto",
                          border: "4px solid var(--darker-gray)",
                        }}
                        sizes="100vw"
                      />
                      <h3
                        className="subsubheader-text"
                        style={{
                          color: "var(--dark-gray)",
                          paddingLeft: "20px",
                        }}
                      >
                        Set Up
                      </h3>
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
                          color: "var(--main-black)",
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
                        width={229}
                        height={221}
                        style={{
                          maxWidth: "35%",
                          height: "auto",
                          position: "absolute",
                          bottom: "40px",
                          right: "5px",
                        }}
                        sizes="100vw"
                      />
                    </Row>
                  </Col>
                </Row>

                <Row justify="space-around" align="middle">
                  <Col
                    xs={24}
                    sm={18}
                    md={16}
                    lg={10}
                    xl={10}
                    xxl={10}
                    style={{ marginTop: "20px" }}
                  >
                    <Row justify="start" align="middle">
                      <Image
                        src={Three}
                        alt="Three"
                        width={100}
                        height={100}
                        style={{
                          maxWidth: "15%",
                          height: "auto",
                          border: "4px solid var(--darker-gray)",
                        }}
                        sizes="100vw"
                      />
                      <h3
                        className="subsubheader-text"
                        style={{
                          color: "var(--dark-gray)",
                          paddingLeft: "20px",
                        }}
                      >
                        Invite
                      </h3>
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
                        width={299}
                        height={193}
                        style={{
                          maxWidth: "55%",
                          height: "auto",
                          position: "absolute",
                          bottom: "5px",
                          left: "5px",
                        }}
                        sizes="100vw"
                      />
                      <p
                        className="body-text"
                        style={{
                          color: "var(--main-black)",
                          textAlign: "end",
                          padding: "15px 15px 0px 0px",
                          marginBottom: "auto",
                          maxWidth: "55%",
                        }}
                      >
                        Once the game is set, invite your friends using the game
                        code and start playing! Track the lobby and look over
                        the game settings before starting.
                      </p>
                    </Row>
                  </Col>
                  <Col
                    xs={24}
                    sm={18}
                    md={16}
                    lg={10}
                    xl={10}
                    xxl={10}
                    style={{ marginTop: "20px" }}
                  >
                    <Row justify="start" align="middle">
                      <Image
                        src={Four}
                        alt="Four"
                        width={100}
                        height={100}
                        style={{
                          maxWidth: "15%",
                          height: "auto",
                          border: "4px solid var(--darker-gray)",
                        }}
                        sizes="100vw"
                      />
                      <h3
                        className="subsubheader-text"
                        style={{
                          color: "var(--dark-gray)",
                          paddingLeft: "20px",
                        }}
                      >
                        Enjoy
                      </h3>
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
                          color: "var(--main-black)",
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
                        width={302}
                        height={194}
                        style={{
                          maxWidth: "55%",
                          height: "auto",
                          position: "absolute",
                          bottom: "5px",
                          right: "5px",
                        }}
                        sizes="100vw"
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
}
