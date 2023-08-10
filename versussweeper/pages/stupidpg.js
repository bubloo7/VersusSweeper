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

export default function Home() {
    const [codeEntered, setCodeEntered] = useState("");
    const [gameExists, setGameExists] = useState(false);

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

    return (
        <Layout>
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
                <Col xs={24} sm={18} md={10} lg={10} xl={10} xxl={10} style={{ marginTop: "20px" }}>
                    <div>
                        <h1 style={{ textAlign: "center" }} className="header-text">
                            Modernize a Classic
                        </h1>
                        <p style={{ textAlign: "center", marginTop: "20px" }} className="body-text">
                            Invite your friends and test your wits in a game of competitive Minesweeper.
                        </p>
                        <Row justify="space-around" align="middle" style={{ marginTop: "20px" }}>
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
        </Layout>
    );
}
