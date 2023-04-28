const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const Redis = require("ioredis");
require('dotenv').config()


const app = express();
const port = 3001;
const redis = new Redis({
    port: 18210,
    host: "redis-18210.c61.us-east-1-3.ec2.cloud.redislabs.com",
    username: "default",
    password: process.env.REDIS_PASSWORD, // Hidden now, but remember it's still accessible in git history
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

app.post("/api/create", async (req, res) => {
    req.setTimeout(0);

    console.log("making new room");
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
    data.players = [];
    console.log(data);

    // Create redis entry
    // await redis.call("JSON.SET", `Chat.${id}`, ".", JSON.stringify(newChat));
    
    // await redis.call("EXPIRE", `Chat.${id}`, 60 * 60 * 24 * 7);

    res.send({ id });
});

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

server.listen(port, () => {
    console.log(`listening on ${port}`);
});
