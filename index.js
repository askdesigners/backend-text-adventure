const express = require("express");
const config = require("config");
const app = express();
const nats = require("./src/nats");
const models = require("./src/lists");

const port = config.get("app.port");

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

nats.connect();