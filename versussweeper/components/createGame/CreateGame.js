import { useFormik } from "formik";
import * as Yup from "yup";
import styles from "./CreateGame.module.css";
import { Button, Checkbox, Row, Col, Input, Space, Divider } from "antd";
import { DownOutlined, RightOutlined } from "@ant-design/icons";
import { useState } from "react";

import Layout from "../Layout";

export default function CreateGame() {
  const [advancedSettingsOpen, setAdvancedSettingsOpen] = useState(false);

  const initialValues = {
    difficulty: 0,
    rows: 9,
    cols: 9,
    mines: 10,
    stunDuration: 5,
    playerLimit: 8,
    disableFlag: false,
    disableMiddleMouse: false,
    seed: "",
    publicRoom: true,
  };

  const validationSchema = Yup.object().shape({
    rows: Yup.number()
      .integer("Rows: Must be an whole number")
      .min(5, "Rows: Must be at least 5")
      .max(20, "Rows: Must be at most 20")
      .required("Rows: Required"),
    cols: Yup.number()
      .integer("Cols: Must be an whole number")
      .min(5, "Cols: Must be at least 5")
      .max(40, "Cols: Must be at most 40")
      .required("Cols: Required"),
    mines: Yup.number()
      .integer("Mines: Must be an whole number")
      .min(0, "Mines: Must be at least 0")
      .max(Yup.ref("maxMines"), "Mines: Must be at most 25% of the board")
      .required("Mines: Required"),
    stunDuration: Yup.number()
      .integer("Stun: Must be an whole number")
      .min(0, "Stun: Must be at least 0")
      .max(60, "Stun: Must be at most 60")
      .required("Stun: Required"),
    playerLimit: Yup.number()
      .integer("Player Limit: Must be an whole number")
      .min(2, "Player Limit: Must be at least 2")
      .max(10, "Player Limit: Must be at most 10")
      .required("Player Limit: Required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      if (Object.keys(formik.errors).length > 0) {
        return;
      }

      const apiCall = {
        difficulty: values.difficulty,
        rows: values.rows,
        cols: values.cols,
        mines: values.mines,
        stunDuration: values.stunDuration,
        playerLimit: values.playerLimit,
        disableFlag: values.disableFlag,
        disableMiddleMouse: values.disableMiddleMouse,
        seed: values.seed,
        publicRoom: values.publicRoom,
      };

      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiCall),
      })
        .then((res) => res.json())
        .then((res) => {
          // redirect to room
          window.location.href = "/" + res.id;
        });
    },
  });

  const {
    difficulty,
    rows,
    cols,
    mines,
    stunDuration,
    playerLimit,
    disableFlag,
    disableMiddleMouse,
    seed,
    publicRoom,
  } = formik.values;

  validationSchema.fields.mines = validationSchema.fields.mines.max(
    Math.floor(rows * cols * 0.25),
    "Mines: Must be at most 25% of the board"
  );

  return (
    <Layout>
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
        <Col span={18}>
          <Row justify="center">
            <h1
              className="header-text"
              style={{ color: "var(--main-black)", textAlign: "center" }}
            >
              Create a game!
            </h1>
          </Row>

          <Row justify="center">
            <p
              className="body-text"
              style={{
                color: "var(--main-black)",
                textAlign: "center",
                marginTop: "10px",
              }}
            >
              Set your preferred game settings and create a game. <br />
              Invite your friends to begin the fun!
            </p>
          </Row>

          <Row
            justify="center"
            style={{
              backgroundColor: "var(--lighter-gray)",
              marginTop: "20px",
              padding: "15px 50px 15px 50px",
            }}
          >
            <Col span={20}>
              <Row justify="start">
                <h2
                  className="button-text"
                  style={{ color: "var(--main-black)", marginBottom: "5px" }}
                >
                  Difficulty:
                </h2>
              </Row>
              <Row justify="center" align="middle" wrap={true}>
                <Col flex={1}>
                  <Button
                    className={
                      difficulty === 0
                        ? "create-button-active"
                        : "create-button"
                    }
                    type="null"
                    onClick={() => {
                      formik.setFieldValue("difficulty", 0);

                      formik.setFieldValue("mines", 10);
                      formik.setFieldValue("rows", 9);
                      formik.setFieldValue("cols", 9);
                      
                    }}
                  >
                    Easy
                  </Button>
                </Col>
                <Col flex={1}>
                  <Button
                    className={
                      difficulty === 1
                        ? "create-button-active"
                        : "create-button"
                    }
                    type="null"
                    onClick={() => {
                      formik.setFieldValue("difficulty", 1);

                      formik.setFieldValue("mines", 40);
                      formik.setFieldValue("rows", 16);
                      formik.setFieldValue("cols", 16);
                      
                    }}
                  >
                    Medium
                  </Button>
                </Col>
                <Col flex={1}>
                  <Button
                    className={
                      difficulty === 2
                        ? "create-button-active"
                        : "create-button"
                    }
                    type="null"
                    onClick={() => {
                      formik.setFieldValue("difficulty", 2);

                      formik.setFieldValue("mines", 99);
                      formik.setFieldValue("rows", 16);
                      formik.setFieldValue("cols", 30);
                    }}
                  >
                    Hard
                  </Button>
                </Col>
                <Col flex={1}>
                  <Button
                    className={
                      difficulty === 3
                        ? "create-button-active"
                        : "create-button"
                    }
                    type="null"
                    onClick={() => {
                      formik.setFieldValue("difficulty", 3);
                    }}
                  >
                    Custom
                  </Button>
                </Col>
              </Row>

              {difficulty === 3 && (
                <Row justify="center">
                  <h3
                    className="button-text"
                    style={{ color: "var(--darker-gray)", marginTop: "10px" }}
                  >
                    Custom Settings: 5-20 Rows, 5-40 Columns, 0-25% Mines
                  </h3>
                </Row>
              )}

              <Row justify="start">
                <h2
                  className="button-text"
                  style={{
                    color: "var(--main-black)",
                    marginBottom: "5px",
                    marginTop: "20px",
                  }}
                >
                  Dimensions:
                </h2>
              </Row>
              <Row justify="center">
                <Col flex={8}>
                  <Row justify="center" align="middle">
                    <p className="button-text">Rows:</p>
                    <Input
                      className={styles.input}
                      type="number"
                      name="rows"
                      disabled={difficulty !== 3}
                      onChange={formik.handleChange}
                      value={rows}
                    />
                  </Row>
                </Col>
                <Col flex={8}>
                  <Row justify="center" align="middle">
                    <p className="button-text">Columns:</p>
                    <Input
                      className={styles.input}
                      type="number"
                      name="cols"
                      disabled={difficulty !== 3}
                      onChange={formik.handleChange}
                      value={cols}
                    />
                  </Row>
                </Col>
              </Row>
              <Row>
                <h2
                  className="button-text"
                  style={{
                    color: "var(--main-black)",
                    marginBottom: "5px",
                    marginTop: "10px",
                  }}
                >
                  Number of Mines:
                </h2>
              </Row>
              <Row justify="center">
                <Col span={14}>
                  <Input
                    className={styles.input}
                    type="number"
                    name="mines"
                    disabled={difficulty !== 3}
                    onChange={formik.handleChange}
                    value={mines}
                  />
                </Col>
              </Row>
              <Row>
                <h2
                  className="button-text"
                  style={{
                    color: "var(--main-black)",
                    marginBottom: "5px",
                    marginTop: "10px",
                  }}
                >
                  Visibility:
                </h2>
              </Row>
              <Row justify="start" wrap={true}>
                <Space size="large" wrap={true}>
                  <Button
                    className={
                      publicRoom ? "create-button-active" : "create-button"
                    }
                    type="null"
                    onClick={() => formik.setFieldValue("publicRoom", true)}
                  >
                    Public
                  </Button>
                  <Button
                    className={
                      !publicRoom ? "create-button-active" : "create-button"
                    }
                    type="null"
                    onClick={() => formik.setFieldValue("publicRoom", false)}
                  >
                    Private
                  </Button>
                </Space>
              </Row>

              <Row
                justify="space-around"
                align="middle"
                wrap={false}
                style={{ marginTop: "50px", marginBottom: "10px" }}
                onClick={() => setAdvancedSettingsOpen(!advancedSettingsOpen)}
              >
                <h2 className="subheader-text">Advanced Settings</h2>
                <h2 className="subheader-text">
                  {advancedSettingsOpen ? (
                    <DownOutlined
                      style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        color: "var(--main-black)",
                      }}
                    />
                  ) : (
                    <RightOutlined
                      style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        color: "var(--main-black)",
                      }}
                    />
                  )}
                </h2>
              </Row>

              {advancedSettingsOpen && (
                <>
                  <Row>
                    <h2
                      className="button-text"
                      style={{
                        color: "var(--main-black)",
                        marginBottom: "5px",
                        marginTop: "10px",
                      }}
                    >
                      Stun Duration (in Seconds):
                    </h2>
                  </Row>
                  <Row justify="center">
                    <Col span={14}>
                      <Input
                        className={styles.input}
                        type="number"
                        name="stunDuration"
                        onChange={formik.handleChange}
                        value={stunDuration}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <h2
                      className="button-text"
                      style={{
                        color: "var(--main-black)",
                        marginBottom: "5px",
                        marginTop: "10px",
                      }}
                    >
                      Max number of players:
                    </h2>
                  </Row>
                  <Row justify="center">
                    <Col span={14}>
                      <Input
                        className={styles.input}
                        type="number"
                        name="playerLimit"
                        onChange={formik.handleChange}
                        value={playerLimit}
                      />
                    </Col>
                  </Row>
                  <Divider />
                  <Row wrap={true} justify="center" align="middle">
                    <Col flex={1}>
                      <Row justify="center" align="middle">
                        <p className="button-text">Disable Flag:</p>
                        <Checkbox
                          type="checkbox"
                          name="disableFlag"
                          onChange={() => {
                            formik.setFieldValue("disableFlag", !disableFlag);
                            if (!disableFlag) {
                              formik.setFieldValue("disableMiddleMouse", true);
                            }
                            if (disableFlag) {
                              formik.setFieldValue("disableMiddleMouse", false);
                            }
                          }}
                          checked={disableFlag}
                        />
                      </Row>
                    </Col>
                    <Col flex={1}>
                      <Row justify="center">
                        <p className="button-text">Disable Middle Mouse:</p>
                        <Checkbox
                          type="checkbox"
                          name="disableMiddleMouse"
                          onChange={formik.handleChange}
                          checked={disableMiddleMouse}
                          disabled={disableFlag}
                        />
                      </Row>
                    </Col>
                  </Row>
                  <Divider />
                  <Row>
                    <h2
                      className="button-text"
                      style={{
                        color: "var(--main-black)",
                        marginBottom: "5px",
                        marginTop: "10px",
                      }}
                    >
                      Set Seed (Random if blank):
                    </h2>
                  </Row>
                  <Row justify="center">
                    <Col span={14}>
                      <Input
                        className={styles.input}
                        style={{ width: "100%" }}
                        type="number"
                        name="seed"
                        onChange={formik.handleChange}
                        value={seed}
                      />
                    </Col>
                  </Row>
                </>
              )}
              <Divider />
              {difficulty === 3 && formik.errors.rows && (
                <Row justify="center" className={styles.errorMessage}>
                  {formik.errors.rows}
                </Row>
              )}
              {difficulty === 3 && formik.errors.cols && (
                <Row justify="center" className={styles.errorMessage}>
                  {formik.errors.cols}
                </Row>
              )}
              {difficulty === 3 && formik.errors.mines && (
                <Row justify="center" className={styles.errorMessage}>
                  {formik.errors.mines}
                </Row>
              )}
              {formik.errors.stunDuration && (
                <Row justify="center" className={styles.errorMessage}>
                  {formik.errors.stunDuration}
                </Row>
              )}
              {formik.errors.playerLimit && (
                <Row justify="center" className={styles.errorMessage}>
                  {formik.errors.playerLimit}
                </Row>
              )}
            </Col>
          </Row>

          <Row justify="center" style={{ marginTop: "40px" }}>
            <Button
              className="black-button"
              type="null"
              style={{
                backgroundColor:
                  Object.keys(formik.errors).length > 0
                    ? "var(--main-red)"
                    : "var(--main-green)",
              }}
              onClick={formik.handleSubmit}
            >
              Create Room
            </Button>
          </Row>
        </Col>
      </Row>
    </Layout>
  );
}
