const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const Redis = require("ioredis");
require("dotenv").config();

const app = express();
const port = 3001;
const redis = new Redis({
  port: 14371,
  host: "redis-14371.c92.us-east-1-3.ec2.cloud.redislabs.com",
  username: "default",
  password: process.env.REDIS_PASSWORD,
});

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// got this from bard lol
function generateRandomId(length) {
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return Array(length)
    .fill(0)
    .map((_, i) =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    )
    .join("");
}

function generateRandomSeed(length) {
  var characters = "0123456789";
  return Array(length)
    .fill(0)
    .map((_, i) =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    )
    .join("");
}

function makeFalseArray(rows, columns) {
  const array = new Array(rows);
  for (let i = 0; i < rows; i++) {
    array[i] = new Array(columns);
    for (let j = 0; j < columns; j++) {
      array[i][j] = false;
    }
  }
  return array;
}

app.post("/api/create", async (req, res) => {
  req.setTimeout(0);

  // Make random string of length 5, all capital letters, no numbers

  let id = generateRandomId(5);

  while (await redis.call("EXISTS", `game:${id}`)) {
    id = generateRandomId(5);
  }

  // get our data from the request
  let data = req.body;
  if (data.seed === "") {
    data.seed = generateRandomSeed(10);
    data.seedRandomlyGenerated = true;
  } else {
    data.seedRandomlyGenerated = false;
  }
  data.nextGameId = "";
  data.gameStarted = false;
  data.startTime = -1;
  data.hostName = "";
  data.firstMoveName = "";
  data.firstColClicked = -1;
  data.firstRowClicked = -1;
  data.players = {};
  data.gameFull = false;

  // Create redis entry
  redis.call("JSON.SET", `game:${id}`, ".", JSON.stringify(data)).then(() => {
    // Set expiration to 3 hrs
    // TODO change expire time later
    redis.call("EXPIRE", `game:${id}`, 60 * 60 * 3);
    res.send({ id });
  });
});

app.post("/api/exists", (req, res) => {
  req.setTimeout(0);

  let id = req.body.id;
  redis.call("EXISTS", `game:${id}`).then((data) => {
    res.send({ exists: data });
  });
});

app.post("/api/join", async (req, res) => {
  req.setTimeout(0);

  const id = req.body.id;
  const name = req.body.name;

  const gameData = JSON.parse(await redis.call("JSON.GET", `game:${id}`, "."));

  // Players already in game
  if (name in gameData.players) {
    const tdata = await redis.call("JSON.GET", `${id}.${name}`);
    res.send({
      gameData,
      playerObj: JSON.parse(tdata),
      playerAlreadyInGame: true,
    });
  }
  // New player, game not full
  else if (Object.keys(gameData.players).length < gameData.playerLimit) {
    const falseArr = makeFalseArray(gameData.rows, gameData.cols);
    const playersElem = {
      name,
      clears: 0,
      misses: 0,
      finishTime: 1682900908681 * 2, // time in the far far future, for when the user has not actually finished yet
    };
    const playerObj = {
      flags: 0,
      stun: -1,
      revealed: falseArr,
      flagged: falseArr,
    };
    gameData["players"][name] = playersElem;
    if (Object.keys(gameData.players).length === 1) {
      await redis.call("JSON.SET", `game:${id}`, `$.hostName`, `\"${name}\"`);
      gameData.hostName = name;
    }

    await redis.call(
      "JSON.SET",
      `game:${id}`,
      `$.players.${name}`,
      JSON.stringify(playersElem)
    );
    await redis.call(
      "JSON.SET",
      `${id}.${name}`,
      ".",
      JSON.stringify(playerObj)
    );

    redis.call("EXPIRE", `${id}.${name}`, 60 * 60 * 3);

    if (Object.keys(gameData.players).length === gameData.playerLimit) {
      redis.call("JSON.SET", `game:${id}`, `$.gameFull`, `true`);
    }

    res.send({ gameData, playerObj, playerAlreadyInGame: false });
  }
  // new player, game full
  else {
    res.send({ gameData: null, playerObj: null, playerAlreadyInGame: null });
  }
});

app.post("/api/joinNextGame", async (req, res) => {
  req.setTimeout(0);
  let id = JSON.parse(
    await redis.call("JSON.GET", `game:${req.body.id}`, `$.nextGameId`)
  )[0];
  console.log(id, "exists");

  if (id !== "") {
    console.log("game exists");
    res.send({ id });
  } else {
    id = generateRandomId(5);
    while (await redis.call("EXISTS", `game:${id}`)) {
      id = generateRandomId(5);
    }
    let data = req.body;
    data.seed = generateRandomSeed(10);
    data.seedRandomlyGenerated = true;
    data.nextGameId = "";
    data.gameStarted = false;
    data.startTime = -1;
    data.hostName = "";
    data.firstMoveName = "";
    data.firstColClicked = -1;
    data.firstRowClicked = -1;
    data.players = {};
    data.gameFull = false;

    // Create redis entry
    redis.call("JSON.SET", `game:${id}`, ".", JSON.stringify(data)).then(() => {
      // Set expiration to 3 hrs
      // TODO change expire time later
      redis.call("EXPIRE", `game:${id}`, 60 * 60 * 3);
      redis
        .call("JSON.SET", `game:${req.body.id}`, `$.nextGameId`, `\"${id}\"`)
        .then(() => {
          res.send({ id });
        });
    });
  }
});

app.post("/api/publicGames", async (req, res) => {
  req.setTimeout(0);

  const difficulty = req.body.difficulty;

  const filteredGames = await redis.call(
    "FT.SEARCH",
    "games_idx",
    `@difficulty:[${difficulty} ${difficulty}] @gameFull:{false} @publicRoom:{true}`,
    "LIMIT",
    0,
    10
  );

  res.send({ filteredGames });
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", async (socket) => {
  const id = socket.handshake.query.id;
  socket.join(id);

  redis.incr("_players");

  socket.on("newPlayer", (data) => {
    socket.broadcast.to(id).emit("newPlayer", data);
  });

  socket.on("test", (data) => {
    console.log("socket test", data);
  });

  socket.on("startGameToServer", () => {
    redis.call("JSON.OBJKEYS", `game:${id}`, "$.players").then((data) => {
      const firstMoveName = data[0][Math.floor(Math.random() * data[0].length)];
      redis
        .call(
          "JSON.SET",
          `game:${id}`,
          `$.firstMoveName`,
          `\"${firstMoveName}\"`
        )
        .then(() => {
          redis
            .call("JSON.SET", `game:${id}`, `$.gameStarted`, `true`)
            .then(() => {
              io.to(id).emit("startGameToClient", { firstMoveName });
            });
        });
    });
  });

  socket.on("firstMoveToServer", async (data) => {
    const checkStartTime = JSON.parse(
      await redis.call("JSON.GET", `game:${id}`, `$.startTime`)
    );
    if (checkStartTime !== -1) {
      await redis.call(
        "JSON.SET",
        `game:${id}`,
        `$.firstColClicked`,
        `${data.firstColClicked}`
      );
      await redis.call(
        "JSON.SET",
        `game:${id}`,
        `$.firstRowClicked`,
        `${data.firstRowClicked}`
      );
      data.startTime = Date.now();
      await redis
        .call("JSON.SET", `game:${id}`, `$.startTime`, `${data.startTime}`)
        .then();
      io.to(id).emit("firstMoveToClient", data);
    }
  });

  socket.on("revealToServer", async (data) => {
    const hits = await redis.call(
      "JSON.NUMINCRBY",
      `game:${id}`,
      `$.players.${data.name}.clears`,
      data.hits
    );
    const misses = await redis.call(
      "JSON.NUMINCRBY",
      `game:${id}`,
      `$.players.${data.name}.misses`,
      data.misses
    );
    for (let i = 0; i < data.revealedIndices.length; i++) {
      redis.call(
        "JSON.SET",
        `${id}.${data.name}`,
        `$.revealed[${data.revealedIndices[i][0]}][${data.revealedIndices[i][1]}]`,
        "true"
      );
    }
    if (data.finishTime !== 1682900908681 * 2) {
      redis.call(
        "JSON.SET",
        `game:${id}`,
        `$.players.${data.name}.finishTime`,
        `${data.finishTime}`
      );
    }
    socket.to(id).emit("revealToClient", {
      hits: JSON.parse(hits)[0],
      misses: JSON.parse(misses)[0],
      name: data.name,
      finishTime: data.finishTime,
    });
    const row = data.revealedIndices[data.revealedIndices.length - 1][0];
    const col = data.revealedIndices[data.revealedIndices.length - 1][1];
    if (data.misses > 0) {
      redis.call("JSON.SET", `${id}.${data.name}`, `$.stun`, `${data.stun}`);
      redis.call(
        "JSON.SET",
        `${id}.${data.name}`,
        `$.flagged[${row}][${col}]`,
        "true"
      );
      redis.call("JSON.NUMINCRBY", `${id}.${data.name}`, `$.flags`, 1);
    }
  });

  socket.on("flagToServer", (data) => {
    redis
      .call(
        "JSON.TOGGLE",
        `${id}.${data.name}`,
        `$.flagged[${data.row}][${data.col}]`
      )
      .then((data2) => {
        if (data2[0] === 1) {
          redis.call("JSON.NUMINCRBY", `${id}.${data.name}`, `$.flags`, 1);
        } else
          redis.call("JSON.NUMINCRBY", `${id}.${data.name}`, `$.flags`, -1);
      });
  });

  socket.on("disconnect", () => {
    redis.decr("_players");
  });
});
server.listen(port, () => {
  console.log(`listening on ${port}`);
});
