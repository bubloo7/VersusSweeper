import { Col, Row } from "antd";
import Image from "next/image";
import Flag from "../images/retro/flag-logo.svg";
import Link from "next/link";
import Icon from "@ant-design/icons";

const DiscordSvg = () => (
  <svg width="1em" height="1em" viewBox="0 0 127.14 96.36" fill="none">
    <path
      d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"
      fill="var(--main-black)"
    />
  </svg>
);

const DiscordIcon = (props) => <Icon component={DiscordSvg} {...props} />;

export default function Header() {

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
        className="hide-small"
      >
        <Col flex={2}>
          <Row justify="start" align="middle" style={{ marginLeft: "60px" }}>
            <Link
              href="/"
              passHref
              className="subheader-text"
              style={{
                color: "var(--main-black)",
              }}
            >
              Versus Sweeper
            </Link>
          </Row>
        </Col>
        <Col flex={1}>
          <Row justify="space-around" align="middle">
            <Link
              href="/about"
              passHref
              className="subheader-text header"
              style={{
                color: "var(--main-black)",
              }}
            >
              About Us
            </Link>
            <Link href="https://google.com" passHref>
              <DiscordIcon className="header-text" />
            </Link>
          </Row>
        </Col>
      </Row>

      <Row
        justify="space-around"
        align="middle"
        wrap={false}
        style={{
          backgroundColor: "var(--light-gray)",
          border: "3px solid var(--darker-gray)",
          height: "80px",
          padding: "0px 30px",
        }}
        className="hide-large"
      >
        <Col flex={2}>
          <Row justify="start" align="middle">
            <Link
              href="/"
              passHref
              className="subheader-text"
              style={{
                color: "var(--main-black)",
              }}
            >
              Versus Sweeper
            </Link>
          </Row>
        </Col>
        <Col flex={1}>
          <Row justify="end" align="middle">
            <Link href="https://google.com" passHref>
              <DiscordIcon className="header-text" />
            </Link>
          </Row>
        </Col>
      </Row>
    </>
  );
}
