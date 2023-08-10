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
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                }}
            >
                <Image
                    src={HeroImage}
                    alt="Hero Image Versus Sweeper"
                    width={549}
                    height={381}
                    style={{ maxWidth: "100%", height: "auto" }}
                    priority={true}
                />
                <div>
                    <h1 style={{ textAlign: "center" }} className="header-text">
                        Modernize a Classic
                    </h1>
                    
                </div>
            </div>
        </Layout>
    );
}
