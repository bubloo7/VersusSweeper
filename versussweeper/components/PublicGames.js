"use client";
import useSWR from "swr";
import React, { useContext, useEffect, useState } from "react";
import { GameContext } from "@/pages/[id]";

export default function PublicGames() {
  const socket = useContext(GameContext);

  const [publicGames, setPublicGames] = useState({});
  const [difficulty, setDifficulty] = useState(0);

  const difficultyMap = {
    0: "Easy",
    1: "Medium",
    2: "Hard",
    3: "Custom",
    };

  // // Make a fetcher function to get data from REDIS API
  const fetcher = async (url) =>
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
        setPublicGames(data.publicGames);
        console.log("publicGames", publicGames);
      });

  const { data, isLoading, isError, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/publicGames`,
    fetcher
  );

  useEffect(() => {
    // Call the fetcher function to update data with new difficulty
    mutate();
  }, [difficulty, mutate]);

  return (
    <div>
      <h1>Public Games</h1>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error loading public games</div>}
      <button
        onClick={() => {
          setDifficulty(0);
        }}
      >
        Easy
      </button>
      <button
        onClick={() => {
          setDifficulty(1);
        }}
      >
        Medium
      </button>
      <button
        onClick={() => {
          setDifficulty(2);
        }}
      >
        Hard
      </button>
      <button
        onClick={() => {
          setDifficulty(3);
        }}
      >
        Custom
      </button>
      
      <h2>{difficultyMap[difficulty]}</h2>
      {publicGames === {} && <div>No public games</div>}
      {Object.keys(publicGames).map((key) => {
        return (
          <div key={key}>
            {key} {difficultyMap[publicGames[key].difficulty]}
          </div>
        );
      })}
    </div>
  );
}
