const { buildMap } = require("../places/index");
const { buildActors } = require("../actors/index");
const { buildThings } = require("../things/index");
const { buildActions } = require("../actions/index");
const Game = require("./Game");

const Gameinit = function(gameData) {
  const {
    placesData,
    actorsData,
    thingsData,
    startPosition,
    playerName,
    themes,
  } = gameData;

  return new Game({
    playerName,
    currentPosition: startPosition,
    map: buildMap(placesData),
    things: buildThings(thingsData),
    actors: buildActors(actorsData),
    actions: buildActions([]),
    themes,
  });
};

module.exports = Gameinit;
