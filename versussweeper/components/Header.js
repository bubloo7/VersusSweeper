import { Row } from "antd";
import Image from "next/image";
import Flag from "../images/retro/flag-logo.png";

export default function Header() {
    const navigateHome = () => {
        window.location.href = "/";
    };

    const navigateToAboutUs = () => {
        window.location.href = "/about";
    };

    return (
        <>
            <Row
                justify="space-around"
                align="middle"
                style={{
                    backgroundColor: "var(--light-gray)",
                    border: "3px solid var(--darker-gray)",
                    height: "80px",
                }}
            >
                <h1
                    className="subheader-text hide-small"
                    style={{
                        color: "var(--main-black)",
                        position: "absolute",
                        left: "60px",
                        cursor: "pointer",
                    }}
                    onClick={navigateHome}
                >
                    VersusSweeper
                </h1>
                <Image
                    src={Flag}
                    alt="logo"
                    height={40}
                    style={{ position: "absolute", left: "auto", right: "auto", cursor: "pointer" }}
                    onClick={navigateHome}
                />
                <p
                    className="subheader-text hide-small"
                    style={{
                        color: "var(--white-text)",
                        position: "absolute",
                        right: "80px",
                        cursor: "pointer",
                    }}
                    onClick={navigateToAboutUs}
                >
                    About Us
                </p>
            </Row>
        </>
    );
}
