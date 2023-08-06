import { Col, Row } from "antd";
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
        justify="center"
        align="middle"
        style={{
          backgroundColor: "var(--light-gray)",
          border: "3px solid var(--darker-gray)",
          height: "80px",
        }}
      >
        <Col>
          <p
            className="body-text"
            style={{ color: "var(--white-text)", textAlign: "center" }}
          >
            VERSUSSWEEPER 2023
          </p>
          <p
            className="body-text"
            style={{ color: "var(--white-text)", textAlign: "center" }}
          >
            1.0.0
          </p>
        </Col>
      </Row>
    </>
  );
}
