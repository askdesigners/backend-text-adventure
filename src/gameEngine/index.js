const { buildMap } = require("./placeBuilder");
const parser = require("./parsing/parser");
const userService = require("../services/user.service");
const itemService = require("../services/items.service");
const moveService = require("../services/move.service");
const listeners = require("./gameData/listeners");
const Game = require("./Game");

const Gameinit = function(gameData) {
  const {
    mapData,
    messageBus,
  } = gameData;
  console.log(messageBus);
  return new Game({
    map: buildMap(mapData),
    messageBus,
    parser,
    userService,
    itemService,
    moveService,
    listeners
  });
};

module.exports = Gameinit;
