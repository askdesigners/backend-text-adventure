const config = require("config");
const express = require("express");
const NatsClient = require("./src/nats");
const Db = require("./src/db");
const Game = require("./src/gameEngine");

const natsServers = config.get("nats.servers");
const port = config.get("app.port");
const mongoUri = config.get("mongo.mongoUri");
const mapData = require(`./map/${config.get("app.map")}.json`);

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

(async ()=>{
  const dbOptions = {bufferCommands: true, useNewUrlParser: true, useUnifiedTopology: true };
  const dbConnection = await Db.connect({dbUrl: mongoUri, options: dbOptions});

  // eslint-disable-next-line no-unused-vars
  const game = Game({
    mapData,
    messageBus: new NatsClient({servers: natsServers}),
    dbConnection
  });
})();