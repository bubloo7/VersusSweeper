import Head from "next/head";
import Layout from "@/components/Layout";
import { Row, Col, Divider } from "antd";

import Image from "next/image";
import Link from "next/link";
import AkilImage from "../images/akil-image.jpg";
import YashImage from "../images/yash-image.jpg";
import { LinkedinOutlined } from "@ant-design/icons";

export default function AboutPage() {
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
          paddingTop: "20px",
          paddingBottom: "100px",
        }}
      >
        <Col xs={22} sm={22} md={22} lg={20} xl={20} xxl={20}>
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
              md={20}
              lg={12}
              xl={12}
              xxl={12}
              style={{ marginTop: "30px" }}
            >
              <Row justify="center" align="middle" wrap={true}>
                <Col
                  xs={8}
                  sm={8}
                  md={6}
                  lg={6}
                  xl={6}
                  xxl={6}
                  style={{ marginRight: "20px" }}
                >
                  <Link
                    href="https://www.linkedin.com/in/bubloo7/"
                    passHref
                    legacyBehavior
                  >
                    <a target="_blank" rel="noopener noreferrer">
                      <Image
                        src={AkilImage}
                        alt="Akil Picture"
                        width={150}
                        height={150}
                        className="image-hover"
                      />
                    </a>
                  </Link>
                </Col>
                <Col xs={14} sm={14} md={14} lg={12} xl={10} xxl={10}>
                  <Link
                    href="https://www.linkedin.com/in/bubloo7/"
                    passHref
                    legacyBehavior
                  >
                    <a target="_blank" rel="noopener noreferrer">
                      <Row justify="start" align="middle" wrap={false}>
                        <LinkedinOutlined
                          style={{
                            marginRight: "15px",
                            color: "var(--main-black)",
                          }}
                        />
                        <h2 className="button-text linkedin-hover">
                          {"  "}Akil Rajendra
                        </h2>
                      </Row>
                    </a>
                  </Link>
                  <p className="body-text" style={{ fontSize: "14px" }}>
                    4th Year CS Student at UCSD. Minor in Math. <br /> <br />
                    Hobbies: Chess, Puzzles, Video Games
                  </p>
                </Col>
              </Row>
            </Col>
            <Col
              xs={22}
              sm={22}
              md={20}
              lg={12}
              xl={12}
              xxl={12}
              style={{ marginTop: "30px" }}
            >
              <Row justify="center" align="middle" wrap={true}>
                <Col
                  xs={8}
                  sm={8}
                  md={6}
                  lg={6}
                  xl={6}
                  xxl={6}
                  style={{ marginRight: "20px" }}
                >
                  <Link
                    href="https://www.linkedin.com/in/yash-patki-b17336164/"
                    passHref
                    legacyBehavior
                  >
                    <a target="_blank" rel="noopener noreferrer">
                      <Image
                        src={YashImage}
                        alt="Yash Picture"
                        width={150}
                        height={150}
                        className="image-hover"
                      />
                    </a>
                  </Link>
                </Col>
                <Col xs={14} sm={14} md={14} lg={12} xl={10} xxl={10}>
                  <Link
                    href="https://www.linkedin.com/in/yash-patki-b17336164/"
                    passHref
                    legacyBehavior
                  >
                    <a target="_blank" rel="noopener noreferrer">
                      <Row justify="start" align="middle" wrap={false}>
                        <LinkedinOutlined
                          style={{
                            marginRight: "15px",
                            color: "var(--main-black)",
                          }}
                        />
                        <h2 className="button-text linkedin-hover">
                          {"  "}Yash Patki
                        </h2>
                      </Row>
                    </a>
                  </Link>
                  <p className="body-text" style={{ fontSize: "14px" }}>
                    4th Year Math-CS Student at UCSD. Minor in Business. <br />{" "}
                    <br />
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
              As avid gamers and competitive individuals, we sought to find
              games that would put us in 1v1 situations. There are a lot of
              games on various platforms that gave us the opportunity to
              compete, however, we found a great rivarly in competitive Sudoku
              via the website{" "}
              <a target="_blank" href="https://www.usdoku.com/" rel="noopener">
                usdoku.com
              </a>
              . <br /> <br />
            </p>
            <p
              className="body-text"
              style={{ fontSize: "14px", textIndent: "40px" }}
            >
              The simplicity of taking a classic, everloved game and adding a
              competitive aspect was intriguing. Along with the idea, the clean
              UI and optimized backend made us want to create a similar
              experience for another game we enjoyed. Reaching out to the
              creators of UsDoku, we found guidance regarding the codebase, tech
              stack, and overall website design. Their help and support was
              instrumental in the creation of Versus Sweeper. <br />
            </p>
          </Row>
        </Col>
      </Row>
    </Layout>
  );
}
