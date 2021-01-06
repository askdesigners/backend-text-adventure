const config = require("config");
const express = require("express");
const NatsClient = require("./src/nats");
const Game = require("./src/gameEngine");

const natsServers = config.get("nats.servers");
const port = config.get("app.port");
const mapData = require(`../map/${config.get("app.map")}`);

const app = express();

app.get("/ping", (req, res)=>{
  res.json({
    status: "ok",
    message: "pong"
  });
});

app.listen(port, () => {
  console.log(`[SERVER] listening on http://localhost:${port}`);
});

const game = Game({
  mapData,
  messageBus: new NatsClient({servers: natsServers})
});