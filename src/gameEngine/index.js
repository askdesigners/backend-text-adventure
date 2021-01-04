const { buildMap } = require("./placeBuilder");
const { parser } = require("./parsing/parser");
const Game = require("./Game");

const Gameinit = function(gameData) {
  const {
    mapData,
    messageBus,
  } = gameData;

  return new Game({
    map: buildMap(mapData),
    messageBus,
    parser
  });
};

module.exports = Gameinit;
