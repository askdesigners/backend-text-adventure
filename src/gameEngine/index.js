import { buildMap } from "../places/index";
import { buildActors } from "../actors/index";
import { buildThings } from "../things/index";
import { buildActions } from "../actions/index";
import Game from "./Game";

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

export default Gameinit;
