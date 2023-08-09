import { Col, Row } from "antd";
import Link from "next/link";

export default function Header() {

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
            style={{ color: "var(--main-black)", textAlign: "center" }}
          >
            VersusSweeper 2023. | 1.0.0
          </p>
          <Row justify="center" align="middle" style={{marginTop: "10px"}}>
          <Link
            href="/about"
            passHref
            className="hide-large body-text"
            style={{
              color: "var(--white-text)",
            }}
          >
            ABOUT US
          </Link>
          </Row>
        </Col>
      </Row>
    </>
  );
}
