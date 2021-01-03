const { buildMap } = require("../places/index");
const Game = require("./Game");

const Gameinit = function(gameData) {
  const {
    mapData,
    messageBus
  } = gameData;

  return new Game({
    map: buildMap(mapData),
    messageBus
  });
};

module.exports = Gameinit;
