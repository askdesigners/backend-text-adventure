const express = require("express");
const config = require("config");
const fs = require("fs");
const app = express();
const nats = require("./src/nats");
const Game = require("./src/gameEngine");

const port = config.get("app.port");
const mapName = config.get("app.config");
const mapData = require(`../map/${mapName}`);


app.get("/ping", (req, res)=>{
  res.json({
    status: "ok",
    message: "pong"
  });
});

app.listen(port, () => {
  console.log(`[SERVER] listening on http://localhost:${port}`);
});

nats.connect();

const game = Game({
  mapData,
  messageBus: nats
});