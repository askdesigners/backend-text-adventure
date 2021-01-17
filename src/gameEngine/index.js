const { buildMap } = require("./placeBuilder");
const { parser } = require("./parsing/parser");
const userService = require("../services/user.service");
const itemService = require("../services/items.service");
const moveService = require("../services/move.service");
const Game = require("./Game");

const Gameinit = function(gameData) {
  const {
    mapData,
    messageBus,
  } = gameData;

  return new Game({
    map: buildMap(mapData),
    messageBus,
    parser,
    userService,
    itemService,
    moveService
  });
};

module.exports = Gameinit;
