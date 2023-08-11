import { Row, Col, Button } from "antd";
import Link from "next/link";

export default function GameFull() {
  return (
    <>
      <Row
        wrap={false}
        justify="center"
        align="middle"
        style={{ height: "100vh", backgroundColor: "var(--background-color)" }}
      >
        <Col flex="160px">{/* Gutter */}</Col>
        <Col flex="1 0 20%">
          <h2
            style={{
              fontSize: "84px",
              paddingRight: "40px",
              color: "var(--main-black)",
            }}
            className="mine-sweeper"
            align="right"
          >
            *
          </h2>
        </Col>
        <Col flex="1 0 40%" style={{ paddingLeft: "40px" }}>
          <Row justify="left">
            <h1 className="header-text" style={{ color: "var(--main-black)" }}>
              Game already full!
            </h1>
          </Row>
          <Row>
            <p className="body-text" style={{ color: "var(--main-black)" }}>
              Join a different game or create your own.
            </p>
          </Row>
          <Row>
            <Link href="/" passHref>
              <Button
                className="black-button"
                style={{ marginTop: "30px" }}
                type="null"
              >
                Return Home
              </Button>
            </Link>
          </Row>
        </Col>
        <Col flex="160px">{/* Gutter */}</Col>
      </Row>
    </>
  );
}
