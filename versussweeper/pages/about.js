import Head from "next/head";
import Layout from "@/components/Layout";
import { Row, Col, Divider } from "antd";

import Image from "next/image";
import Sample from "../images/flappybird.png";

export default function About() {
  return (
    <Layout>
      <Head>
        <title>About</title>
      </Head>
      <Row
        wrap={false}
        justify="center"
        align="middle"
        gutter={0}
        style={{
          height: "auto",
          backgroundColor: "var(--background-color)",
          paddingTop: "50px",
          paddingBottom: "100px",
        }}
      >
        <Col xs={22} sm={22} md={20} lg={20} xl={20} xxl={20}>
          <Row justify="center" style={{ marginTop: "40px" }}>
            <h2 className="subheader-text" style={{ textAlign: "center" }}>
              Our Team
            </h2>
          </Row>

          <Row
            justify="space-around"
            align="middle"
            style={{
              marginTop: "40px",
              paddingBottom: "30px",
              backgroundColor: "var(--lighter-gray)",
              border: "3px solid var(--darker-gray)",
            }}
          >
            <Col
              xs={22}
              sm={22}
              md={12}
              lg={12}
              xl={12}
              xxl={12}
              style={{ marginTop: "30px" }}
            >
              <Row justify="space-around" align="middle">
                <Col xs={8} sm={8} md={2} lg={2} xl={2} xxl={2}>
                  <Image
                    src={Sample}
                    alt="Akil Picture"
                    width={100}
                    height={100}
                  />
                </Col>
                <Col xs={14} sm={14} md={10} lg={10} xl={10} xxl={10}>
                  <h2 className="button-text">Akil</h2>
                  <p className="body-text" style={{ fontSize: "14px" }}>
                    4th Year CS Student at UCSD. Worked on the Backend, DevOps,
                    and Deployment. <br /> <br />
                    Hobbies: Pillows, Anime, Video Games
                  </p>
                </Col>
              </Row>
            </Col>
            <Col
              xs={22}
              sm={22}
              md={12}
              lg={12}
              xl={12}
              xxl={12}
              style={{ marginTop: "30px" }}
            >
              <Row justify="space-around" align="middle">
                <Col xs={8} sm={8} md={2} lg={2} xl={2} xxl={2}>
                  <Image
                    src={Sample}
                    alt="Yash Picture"
                    width={100}
                    height={100}
                  />
                </Col>
                <Col xs={14} sm={14} md={10} lg={10} xl={10} xxl={10}>
                  <h2 className="button-text">Yash</h2>
                  <p className="body-text" style={{ fontSize: "14px" }}>
                    4th Year Math-CS Student at UCSD. Worked on the UX/UI and
                    Frontend. <br /> <br />
                    Hobbies: Cricket, Travelling, YouTube
                  </p>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row justify="center" style={{ marginTop: "40px" }}>
            <h2 className="subheader-text" style={{ textAlign: "center" }}>
              Our Inspiration
            </h2>
          </Row>

          <Row
            justify="space-around"
            align="middle"
            style={{ margin: "40px 20px 0px 20px" }}
          >
            <p
              className="body-text"
              style={{ fontSize: "14px", textIndent: "40px" }}
            >
              {"    "}As avid gamers and competitive individuals, we sought to
              find games that would put us in 1v1 situations. There are a lot of
              games on various platforms that provided us the opportunity to
              compete, however, we found a great rivarly in competitive Sudoku
              via the website usdoku.com. <br /> <br />
            </p>
            <p
              className="body-text"
              style={{ fontSize: "14px", textIndent: "40px" }}
            >
              {"    "}The simplicity of taking a classic, everloved game and
              bringing a competitive aspect to it was intriguing. Along with the
              idea, the clean UI and optimized backend made us want to create a
              similar experience for another game we enjoyed. Reaching out to
              the creators of usdoku.com, we were able to find guidance
              regarding the codebase, tech stack, and overall design of the
              website. Their help and support was instrumental in the creation
              of VersusSweeper. <br />
            </p>
          </Row>
        </Col>
      </Row>
    </Layout>
  );
}
