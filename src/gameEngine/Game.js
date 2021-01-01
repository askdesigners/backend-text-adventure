/* eslint-disable class-methods-use-this */
const {commands} = require("../gameData/commands");
const {validators} = require("../gameData/validators");
const {parser} = require("../utils/parser");
const {removeFromArray} = require("../utils/removeFromArray");
const {listize} = require("../utils/listize");
const crypto = require("crypto");

function dec2hex(dec) {
  return dec < 10 ? `0${String(dec)}` : dec.toString(16);
}

/**
 *
 *
 * @class Game
 *
 *  This is the main game wrapper object. All main game actions are in here.
 */
class Game {
  /**
   *
   * Creates an instance of Game.
   *
   * @param {object} map The world map
   * @param {object} currentPosition Current position in the world
   * @param {object} playerName The player's name // TODO this should be an instance of Actor
   * @param {object} actors Other players on the map. Instances of Actor. // TODO rethink
   * @param {object} things Things that the player can interact with. Instances of Thing
   * @param {object} themes Color themes for map
   *
   * @memberOf Game
   */
  constructor({ map, currentPosition, playerName, actors, things, themes }) {
    this.turn = 0;
    this.map = map;
    this.currentPosition = currentPosition;
    this.playerName = playerName;
    this.actors = actors;
    this.things = things;
    this.setupParsing();
    this.moveHistory = ["a1"];
    this.commandHistory = [];
    this.themes = themes;
  }

  /**
   *
   * Adds a message identifier to the message object
   *
   * @memberOf Game
   */
  addMessageId(message) {
    const arr = new Uint8Array(30 / 2);
    crypto.getRandomValues(arr);
    message.id = Array.from(arr, dec2hex).join("");
    return message;
  }

  /**
   *
   * Passes the constructed Game to the command parser, and command validators.
   *
   * @memberOf Game
   */
  setupParsing() {
    commands(this);
    validators(this);
  }

  /**
   *
   * Takes input text, and pushes to command history.
   *
   * @param {string} text The input text to parse.
   *
   * @memberOf Game
   */
  parseText(text) {
    this.responseHandler(
      this.addMessageId({
        source: "player",
        player: "self",
        message: text,
      }),
    );
    this.commandHistory.push(text);
    parser.parse(text);
  }

  /**
   *
   * Sends messages to all players in radius
   *
   * @param {string} message Text to say
   *
   * @memberOf Game
   */
  say(message) {
    this.chatHandler(
      this.addMessageId({
        message,
        source: "playerChat",
        player: this.playerName,
      })
    );
  }

  /**
   *
   * Moves the player on the map.
   *
   * @param {string} dir Direction to walk - {n,s,e,w}
   *
   * @memberOf Game
   */
  moveTo(dir) {
    const startPos = this.currentPosition;
    const next = this.map[this.currentPosition].getNeighbor(dir);
    const result = this._handleMove(this.currentPosition, next);
    if (result.success === true) {
      this.moveHandler({ from: startPos, to: next });
      result.dir = dir;
    }
    this.responseHandler(result);
  }

  /**
   *
   * Moves the player back to the previous place.
   *
   * @memberOf Game
   */
  moveBack() {
    try {
      const startPos = this.currentPosition;
      const next = this.moveHistory[this.moveHistory.length - 2];
      const dir = this._getMoveDir(startPos, next);
      const result = this._handleMove(this.currentPosition, next);
      if (result.success === true) {
        console.log("dir", dir);
        result.dir = dir;
        this.moveHandler({ from: startPos, to: next });
      }
      this.responseHandler(result);
    } catch (error) {
      console.log(error);
      // this.responseHandler(result);
    }
  }

  /**
   * Returns adjacent cells by name
   *
   * @param {*} pos
   * @memberof Game
   */
  getAdjacent(pos) {
    const currentpos = this.map[pos];
    if (currentpos) {
      return [
        currentpos.toE,
        currentpos.toW,
        currentpos.toN,
        currentpos.toS,
        pos,
      ].filter(f => f);
    }
    return [];
  }

  /**
   *
   * Has the user pick up an object and describe it. Updates things map.
   *
   * @param {string} thing Slug name of thing to pick up.
   *
   * @memberOf Game
   */
  pickupThing(thing) {
    let result = {};
    if (this.things.collection[thing].heldBy === null) {
      if (this._thingIsNearby(thing)) {
        if (this.things.collection[thing].canHold !== false) {
          result = this.things.collection[thing].onPickUp();
          if (result.success === true) {
            console.log("taking: ", thing, "from", this.currentPosition);
            // flag thing obj as held
            this.things.collection[thing].heldBy = "player";
            // add thing to game (or sync with mobx?)
            this.things.map[this.currentPosition] = removeFromArray(
              this.things.map[this.currentPosition],
              thing,
            );
          }
        } else {
          result.success = false;
          result.message = "You can't take that.";
        }
      } else {
        result.success = false;
        result.message = `There is no ${thing} here.`;
      }
    } else if (this._isHeldByplayer(thing)) {
      result.success = false;
      result.message = "You are already holding that.";
    } else {
      result.success = false;
      result.message = "Someone is already holding that";
    }

    result.valid = true;
    result.source = "game";
    this.responseHandler(result);
  }

  /**
   *
   * Has the player put down the object, adding it back to the map.
   *
   * @param {string} thing Slug name of object.
   *
   * @memberOf Game
   */
  putDownThing(thing) {
    const result = {};
    if (this._isHeldByplayer(thing)) {
      this.things.collection[thing].onDrop();
      this.things.collection[thing].heldBy = null;
      this.things.collection[thing].position = this.currentPosition;
      result.success = true;
      result.message = `You put down the ${thing}`;
      if (this.things.map[this.currentPosition] === undefined) {
        this.things.map[this.currentPosition] = [];
        this.things.map[this.currentPosition].push(thing);
      } else {
        this.things.map[this.currentPosition].push(thing);
      }
    } else {
      result.success = false;
      result.message = "You're not holding that.";
    }
    result.source = "game";
    result.valid = true;
    this.responseHandler(result);
  }

  /**
   *
   * Is called when no command is matched.
   *
   * @param {any} result Result of command rejection
   *
   * @memberOf Game
   */
  noCommandFound() {
    this.responseHandler({
      success: false,
      valid: false,
      source: "game",
      message: "I don't follow you...",
    });
  }

  /**
   *
   * Adds a handler function which is called when the game responds to the user. Adds text into the main text area etc.
   *
   * @param {function} fn
   *
   * @memberOf Game
   */
  addResponseHandler(fn) {
    this.responseHandler = message => {
      return fn(this.addMessageId(message));
    };
    // emit starting message
    fn(
      this.addMessageId({
        success: true,
        message: this.map[this.currentPosition].description,
      }),
    );
  }

  /**
   *
   * Adds a handler function which is called when the player moves to a new square.
   *
   * @param {function} fn
   *
   * @memberOf Game
   */
  addMoveHandler(fn) {
    this.moveHandler = ({ to, from }) => {
      return fn({ to, from });
    };
    // emit starting pos
    fn({ to: this.currentPosition, from: null });
  }

  /**
   *
   * Adds a handler function which is called when the player sends a chat message.
   *
   * @param {function} fn
   *
   * @memberOf Game
   */
  addChatHandler(fn) {
    this.chatHandler = fn;
  }

  /**
   *
   * Adds a handler function for updating the color theme of main area.
   *
   * @param {any} fn
   *
   * @memberOf Game
   */
  addThemeHandler(fn) {
    this.themeHandler = fn;
    fn(this.themes[this.map[this.currentPosition].colorTheme]);
  }

  /**
   *
   * Has player look at some object and describe it.
   *
   * @param {string} thing Thing to look at
   *
   * @memberOf Game
   */
  lookAt(thing) {
    const result = {};
    if (this._thingIsNearby(thing)) {
      result.success = true;
      result.message = this.things.collection[thing].inspect();
    } else {
      result.success = false;
      result.message = `There is no ${thing} here.`;
    }
    result.source = "game";
    this.responseHandler(result);
  }

  /**
   *
   * Describes the immediate surroundings.
   *
   * @memberOf Game
   */
  lookAround() {
    const result = {};
    result.message = this.map[this.currentPosition].describe();

    const thingsHere = this.things.map[this.currentPosition];
    if (thingsHere !== undefined) {
      const str = `<br/> In this room there's ${listize(thingsHere)}.`;
      result.message += str;
    } else {
      result.message = "There's nothing here to see really...";
    }
    result.success = true;
    result.source = "game";
    this.responseHandler(result);
  }

  /**
   *
   * Opens an openable object.
   *
   * @memberOf Game
   */
  openThing() {}

  /**
   *
   * Activates and object which can be activated.
   *
   * @memberOf Game
   */
  activateThing() {}

  /**
   *
   * Saves the current game.
   *
   * @memberOf Game
   */
  save() {}

  /**
   *
   * Determines if an object is in the same square as the player
   *
   * @param {any} thing
   * @returns {boolean}
   *
   * @memberOf Game
   */
  _thingIsNearby(thing) {
    return this.things.collection[thing].position === this.currentPosition;
  }

  /**
   *
   * Determines whether an object is held by the player.
   *
   * @param {any} thing
   * @returns
   *
   * @memberOf Game
   */
  _isHeldByplayer(thing) {
    return this.things.collection[thing].heldBy === "player";
  }

  /**
   *
   * Does the actual moving. Calls .onEnter() of the square moved into.
   *
   * @param {any} curPos
   * @param {any} nextPos
   * @returns
   *
   * @memberOf Game
   */
  _handleMove(curPos, nextPos) {
    let result = {};
    if (nextPos !== false) {
      result = this.map[nextPos].onEnter();
      if (result.success === true) {
        this.map[curPos].onLeave();
        this.currentPosition = nextPos;
        this.moveHistory.push(this.currentPosition);
        this.themeHandler(
          this.themes[this.map[this.currentPosition].colorTheme],
        );
      }
    } else {
      result.success = false;
      result.message = "That way is blocked";
    }
    result.valid = true;
    result.source = "game";
    return result;
  }

  /**
   * Extract move dir from current and next pos
   *
   * @param {*} current
   * @param {*} next
   * @returns
   * @memberof Game
   */
  _getMoveDir(current, next) {
    console.log("get dir", current, next);
    if (!next || !current) return null;
    let currentSpot = this.map[current];
    currentSpot = {
      toE: current.toE,
      toW: current.toW,
      toS: current.toS,
      toN: current.toN,
    };
    return Object.keys(currentSpot).reduce((dir, key) => {
      const match = currentSpot[key] === next ? currentSpot[key] : false;
      if (match === "toE") return "east";
      if (match === "toW") return "west";
      if (match === "toS") return "south";
      if (match === "toN") return "north";
      return dir;
    }, "");
    // .filter(f => f)[0];
  }
}

module.exports = Game;