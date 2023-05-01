const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const Redis = require("ioredis");
require("dotenv").config();

const app = express();
const port = 3001;
const redis = new Redis({
    port: 18210,
    host: "redis-18210.c61.us-east-1-3.ec2.cloud.redislabs.com",
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
        .map((_, i) => characters.charAt(Math.floor(Math.random() * characters.length)))
        .join("");
}

function generateRandomSeed(length) {
    var characters = "0123456789";
    return Array(length)
        .fill(0)
        .map((_, i) => characters.charAt(Math.floor(Math.random() * characters.length)))
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

function objInList(list, field, target) {
    for (let i = 0; i < list.length; i++) {
        if (list[i][field] === target) {
            return true;
        }
    }
    return false;
}

app.post("/api/create", async (req, res) => {
    req.setTimeout(0);

    // Make random string of length 5, all capital letters, no numbers

    let id = generateRandomId(5);

    while (await redis.call("EXISTS", `${id}`)) {
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

    // Create redis entry
    redis.call("JSON.SET", `${id}`, ".", JSON.stringify(data)).then(() => {
        // Set expiration to 3 hrs
        // TODO change expire time later
        redis.call("EXPIRE", `${id}`, 60 * 60 * 3);
        res.send({ id });
    });
});

app.post("/api/exists", (req, res) => {
    req.setTimeout(0);

    let id = req.body.id;
    redis.call("EXISTS", `${id}`).then((data) => {
        res.send({ exists: data });
    });
});

app.post("/api/join", async (req, res) => {
    req.setTimeout(0);

    const id = req.body.id;
    const name = req.body.name;

    const gameData = JSON.parse(await redis.call("JSON.GET", id, "."));

    // Players already in game
    if (name in gameData.players) {
        const tdata = await redis.call("JSON.GET", `${id}.${name}`);
        res.send({ gameData, playerObj: JSON.parse(tdata), playerAlreadyInGame: true });
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
            clicked: falseArr,
        };
        gameData["players"][name] = playersElem;
        if (Object.keys(gameData.players).length === 1) {
            await redis.call("JSON.SET", `${id}`, `$.hostName`, `\"${name}\"`);
            gameData.hostName = name;
        }

        await redis.call("JSON.SET", `${id}`, `$.players.${name}`, JSON.stringify(playersElem));
        await redis.call("JSON.SET", `${id}.${name}`, ".", JSON.stringify(playerObj));

        redis.call("EXPIRE", `${id}.${name}`, 60 * 60 * 3);
        res.send({ gameData, playerObj, playerAlreadyInGame: false });
    }
    // new player, game full
    else {
        res.send({ gameData: null, playerObj: null, playerAlreadyInGame: null });
    }
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

    // Get data from redis

    // redis.call("JSON.GET", `${id}`, ".").then((data) => {
    //     data = JSON.parse(data);

    //     console.log(data, "data from redis");
    //     if (data === null) {
    //         socket.emit("joinRoom", "DNE");
    //     } else socket.emit("joinRoom", data);
    // });

    redis.incr("_players");

    socket.on("newPlayer", (data) => {
        console.log("newPlayer received in server");
        socket.broadcast.to(id).emit("newPlayer", data);
    });

    socket.on("test", (data) => {
        console.log("socket test", data);
    });

    socket.on("disconnect", () => {
        redis.decr("_players");
    });
});
server.listen(port, () => {
    console.log(`listening on ${port}`);
});
