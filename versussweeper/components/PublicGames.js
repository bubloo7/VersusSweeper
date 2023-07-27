"use client";
import useSWR from "swr";
import React, { useEffect, useState } from "react";
import { GameContext } from "@/pages/[id]";
import { Pagination } from "antd";

export default function PublicGames() {
  const [publicGames, setPublicGames] = useState({});
  const [difficulty, setDifficulty] = useState(0);

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
      revalidateOnMount: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  useEffect(() => {
    // Call the fetcher function to update data with new difficulty
    mutate();
  }, [difficulty]);


  return (
    <div>
      <h1>Public Games</h1>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error loading public games</div>}
      <button
        style={{
          backgroundColor: difficulty === 0 ? "green" : "white",
          color: difficulty === 0 ? "white" : "black",
          fontWeight: difficulty === 0 ? "bold" : "normal",
          width: "100px",
          height: "50px",
          fontSize: "20px",
        }}
        onClick={() => {
          setDifficulty(0);
        }}
      >
        Easy
      </button>
      <button
        style={{
          backgroundColor: difficulty === 1 ? "green" : "white",
          color: difficulty === 1 ? "white" : "black",
          fontWeight: difficulty === 1 ? "bold" : "normal",
          width: "100px",
          height: "50px",
          fontSize: "20px",
        }}
        onClick={() => {
          setDifficulty(1);
        }}
      >
        Medium
      </button>
      <button
        style={{
          backgroundColor: difficulty === 2 ? "green" : "white",
          color: difficulty === 2 ? "white" : "black",
          fontWeight: difficulty === 2 ? "bold" : "normal",
          width: "100px",
          height: "50px",
          fontSize: "20px",
        }}
        onClick={() => {
          setDifficulty(2);
        }}
      >
        Hard
      </button>
      <button
        style={{
          backgroundColor: difficulty === 3 ? "green" : "white",
          color: difficulty === 3 ? "white" : "black",
          fontWeight: difficulty === 3 ? "bold" : "normal",
          width: "100px",
          height: "50px",
          fontSize: "20px",
        }}
        onClick={() => {
          setDifficulty(3);
        }}
      >
        Custom
      </button>

      <h2>{difficultyMap[difficulty]}</h2>
      {Object.keys(publicGames).length === 0 && <div>No public games</div>}
      {Object.keys(publicGames)
        .map((key) => {
          return (
            <div key={key}>
              {key} {difficultyMap[publicGames[key].difficulty]}{" "}
              {Object.keys(publicGames[key].players).length}/
              {publicGames[key].playerLimit}{" "}
              {publicGames[key].gameStarted ? "In Game" : "In Lobby"}
            </div>
          );
        })}
    </div>
  );
}
