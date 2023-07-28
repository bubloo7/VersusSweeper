import { Button, Row, Col } from "antd";

export default function GameExpired() {
  const returnHome = () => {
    window.location.href = "/";
  };

  return (
    <>
      <Row
        wrap={false}
        justify="center"
        align="middle"
        style={{ height: "100vh", backgroundColor: "var(--background-color)" }}
      >
        <Col flex="160px">{/* Gutter */}</Col>
        <Col flex="1 0 25%">
          <h1
            style={{
              fontSize: "84px",
              paddingRight: "40px",
              color: "var(--main-black)",
            }}
            className="mine-sweeper"
            align="right"
          >
            *
          </h1>
        </Col>
        <Col flex="1 0 45%" style={{ paddingLeft: "40px" }}>
          <Row justify="left">
            <h1 className="header-text" style={{ color: "var(--main-black)" }}>
              Game room expired!
            </h1>
          </Row>
          <Row>
            <p className="body-text" style={{ color: "var(--main-black)" }}>
              Join a different game or create your own.
            </p>
          </Row>
          <Row>
            <Button
              className="black-button"
              style={{ marginTop: "30px" }}
              onClick={returnHome}
              type="null"
            >
              Return Home
            </Button>
          </Row>
        </Col>
        <Col flex="160px">{/* Gutter */}</Col>
      </Row>
    </>
  );
}