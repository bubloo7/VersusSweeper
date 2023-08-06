"use client";
import useSWR from "swr";
import React, { useEffect, useState } from "react";
import { Pagination, Row, Col, Button, Input, Space } from "antd";
import { TeamOutlined, TrophyOutlined } from "@ant-design/icons";
import styles from "./PublicGames.module.css";

import Layout from "../Layout";

export default function PublicGames() {
  const [publicGames, setPublicGames] = useState({});
  const [difficulty, setDifficulty] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * 5;
  const endIndex = Math.min(startIndex + 5, Object.keys(publicGames).length);

  const gamesForPage = Object.keys(publicGames).slice(startIndex, endIndex);

  const difficultyMap = {
    0: "Easy",
    1: "Medium",
    2: "Hard",
    3: "Custom",
  };

  const fetcher = async (url) => {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        difficulty: difficulty,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        let transformedData = {};

        for (let idx = 1; idx < data.filteredGames.length; idx = idx + 2) {
          let game = data.filteredGames[idx].substr(5, 10);
          let gameData = JSON.parse(data.filteredGames[idx + 1][1]);

          transformedData[game] = gameData;
        }

        setPublicGames(transformedData);
      });
  };

  const { data, isLoading, isError, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/publicGames`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnMount: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  useEffect(() => {
    // Call the fetcher function to update data with new difficulty
    mutate();
  }, [difficulty]);

  const refreshPage = () => {
    mutate();
  };

  const navigateToCreate = () => {
    window.location.href = "/create";
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const gamesList = gamesForPage.map((key) => {
    return (
      <Row
        justify="space-around"
        align="middle"
        key={key}
        onClick={() => {
          window.location.href = `/${key}`;
        }}
        className={styles.gameRow}
      >
        <Col span={8}>
          <h1
            className="subsubheader-text"
            style={{
              color: "var(--main-black)",
              textAlign: "start",
            }}
          >
            {key}
          </h1>
        </Col>
        <Col span={4}>
          <Row
            justify="start"
            align="middle"
            style={{ height: "100%", width: "100%" }}
          >
            <TeamOutlined
              style={{ color: "var(--dark-gray)", fontSize: "16px" }}
            />
            <p
              className="body-text"
              style={{ marginLeft: "15px", color: "var(--dark-gray)" }}
            >
              {Object.keys(publicGames[key].players).length}/
              {publicGames[key].playerLimit}
            </p>
          </Row>
          <Row
            justify="start"
            align="middle"
            style={{ height: "100%", width: "100%" }}
          >
            <TrophyOutlined
              style={{ color: "var(--dark-gray)", fontSize: "16px" }}
            />
            <p
              className="body-text"
              style={{ marginLeft: "15px", color: "var(--dark-gray)" }}
            >
              {publicGames[key].gameStarted ? "In Game" : "In Lobby"}
            </p>
          </Row>
        </Col>
      </Row>
    );
  });

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
          paddingTop: "150px",
          paddingBottom: "150px",
        }}
      >
        <Col span={18}>
          <Row justify="center">
            <h1
              className="header-text"
              style={{ color: "var(--main-black)", textAlign: "center" }}
            >
              Public Games
            </h1>
          </Row>
          <Row justify="center">
            <p
              className="body-text"
              style={{
                color: "var(--main-black)",
                textAlign: "center",
                marginTop: "20px",
              }}
            >
              Find a game or create your own to start <br />
              competing with strangers!
            </p>
          </Row>
          <Row
            justify="center"
            align="middle"
            style={{
              marginTop: "30px",
              maxWidth: "460px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <Col flex={6} style={{ alignItems: "end" }}>
              <Button
                className="black-button"
                type="null"
                style={{ marginLeft: "auto", marginRight: "auto" }}
                onClick={refreshPage}
              >
                Refresh
              </Button>
            </Col>
            <Col flex={6}>
              <Button
                className="black-button"
                type="null"
                style={{
                  backgroundColor: "var(--main-green)",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
                onClick={navigateToCreate}
              >
                Create Game
              </Button>
            </Col>
          </Row>
          <Row
            wrap={true}
            justify="space-around"
            align="middle"
            style={{
              marginTop: "60px",
              borderColor: "var(--darker-gray)",
              borderWidth: "2px",
              borderStyle: "solid",
              borderRadius: "0px",
              padding: "20px",
              marginBottom: "40px",
            }}
          >
            <Col flex={1} style={{ textAlign: "center" }}>
              <Button
                className="subheader-text"
                type="null"
                style={{
                  color:
                    difficulty === 0 ? "var(--main-black)" : "var(--dark-gray)",
                }}
                onClick={() => setDifficulty(0)}
              >
                Easy
              </Button>
            </Col>
            <Col flex={1} style={{ textAlign: "center" }}>
              <Button
                className="subheader-text"
                type="null"
                style={{
                  color:
                    difficulty === 1 ? "var(--main-black)" : "var(--dark-gray)",
                }}
                onClick={() => setDifficulty(1)}
              >
                Medium
              </Button>
            </Col>
            <Col flex={1} style={{ textAlign: "center" }}>
              <Button
                className="subheader-text"
                type="null"
                style={{
                  color:
                    difficulty === 2 ? "var(--main-black)" : "var(--dark-gray)",
                }}
                onClick={() => setDifficulty(2)}
              >
                Hard
              </Button>
            </Col>
            <Col flex={1} style={{ textAlign: "center" }}>
              <Button
                className="subheader-text"
                type="null"
                style={{
                  color:
                    difficulty === 3 ? "var(--main-black)" : "var(--dark-gray)",
                }}
                onClick={() => setDifficulty(3)}
              >
                Custom
              </Button>
            </Col>
          </Row>
          {isLoading && <div>Loading...</div>}
          {Object.keys(publicGames).length === 0 && (
            <>
              <Row justify="center">
                <p
                  className="subheader-text"
                  style={{
                    color: "var(--dark-gray)",
                    textAlign: "center",
                  }}
                >
                  <span>No </span>
                  <span style={{ color: "var(--main-green)" }}>
                    {difficultyMap[difficulty]}
                  </span>
                  <span>
                    {" "}
                    games found, why <br /> don&apos;t you make one?
                  </span>
                </p>
              </Row>
              <Row justify="center" style={{ marginTop: "40px" }}>
                <Button
                  className="black-button"
                  type="null"
                  style={{ backgroundColor: "var(--main-green)" }}
                  onClick={navigateToCreate}
                >
                  Create Game
                </Button>
              </Row>
            </>
          )}

          {Object.keys(publicGames).length !== 0 && (
            <Pagination
              current={currentPage}
              onChange={handlePageChange}
              total={Object.keys(publicGames).length}
              pageSize={5}
              responsive={true}
              hideOnSinglePage={false}
              style={{
                marginTop: "20px",
                marginRight: "80px",
                textAlign: "end",
              }}
            />
          )}
          {Object.keys(publicGames).length !== 0 && gamesList}
        </Col>
      </Row>
    </Layout>
  );
}
