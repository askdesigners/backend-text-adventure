/* eslint-disable class-methods-use-this */
const { commands } = require("./gameData/commands");
const { validators } = require("./gameData/validators");
const { listize } = require("./parsing/listize");
const crypto = require("crypto");

function dec2hex(dec) {
  return dec < 10 ? `0${String(dec)}` : dec.toString(16);
}

function makePlaceKey([x, y]){
  return `${x}|${y}`;
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
   * @param {array} currentPosition Current position in the world
   * @param {object} playerName The player's name // TODO this should be an instance of Actor
   * @param {object} actors Other players on the map. Instances of Actor. // TODO rethink
   * @param {object} things Things that the player can interact with. Instances of Thing
   * @param {object} themes Color themes for map
   *
   * @memberOf Game
   */
  constructor({ map, messageBus, parser, moveService, userService, itemService, listeners }) {
    this.turn = 0;
    this.map = map;
    this.messageBus = messageBus;
    this.parser = parser;
    this.userService = userService;
    this.itemService = itemService;
    this.moveService = moveService;
    this.listeners = listeners;
    this.setupParsing();
    this.setupCommandListener();
  }

  setupListeners(){
    this.listeners.map((listener)=>{
      this.messageBus.makeSubscription({subject: listener.route, handler: listener.handler});
    });
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
    commands(this.parser, this);
    validators(this.parser, this);
  }

  /**
   *
   * Takes input text, and pushes to command history.
   *
   * @param {string} text The input text to parse.
   *
   * @memberOf Game
   */
  parseText(user, text) {
    this.responseHandler(
      this.addMessageId({
        user,
        source: "player",
        message: text,
      }),
    );
    return this.parser.parse(text);
  }

  /**
   *
   * Sends messages to all players in radius
   *
   * @param {string} message Text to say
   *
   * @memberOf Game
   */
  say(user, message) {
    this.chatHandler(
      this.addMessageId({
        user,
        message,
        source: "playerChat"
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
  moveTo(user, dir) {
    const startPos = makePlaceKey(user);
    const nextPos = this.map[startPos].getNeighbor(dir);
    const result = this._handleMove(startPos, nextPos);
    if (result.success === true) {
      this.moveHandler({user, from: startPos, to: nextPos });
      result.dir = dir;
    }
    this.responseHandler({user, ...result});
  }

  /**
   *
   * Moves the player back to the previous place.
   *
   * @memberOf Game
   */
  moveBack(user) {
    try {
      const startPos = makePlaceKey(user);
      const next = this.moveHistory[this.moveHistory.length - 2];
      const dir = this._getMoveDir(startPos, next);
      const result = this._handleMove(this.currentPosition, next);
      if (result.success === true) {
        result.dir = dir;
        this.moveHandler({user, from: startPos, to: next });
      }
      this.responseHandler({user, ...result});
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
  async pickupThing(user, item) {
    let result = {user};
    const itemsHere = await this.itemService.getItemsHere(user);
    const desiredItem = itemsHere.filter(i=>i.name === item)[0];

    if (desiredItem) {
      if (desiredItem.heldBy === null) {
        if (desiredItem.canHold !== false) {
          result = desiredItem.onPickUp();
          if (result.success === true) console.log("taking: ", item, "from", this.currentPosition);
        } else {
          result.success = false;
          result.message = "You can't take that.";
        }
      } else if (desiredItem.heldBy === user._id) {
        result.success = false;
        result.message = "You are already holding that.";
      } else {
        // should never happen
        result.success = false;
        result.message = "Someone is already holding that";
      }
    } else {
      result.success = false;
      result.message = `There is no ${item} here.`;
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
  async putDownThing(user, item) {
    const result = {user};
    const userItems = await this.userService.getUserItems(user);
    const desiredItem = userItems.filter(i=>i.name === item)[0];

    if (desiredItem.heldBy === user._id) {
      desiredItem.onDrop();
      result.success = true;
      result.message = `You put down the ${item}`;
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
  noCommandFound(user) {
    this.responseHandler({
      user,
      success: false,
      valid: false,
      source: "game",
      message: "I don't follow you...",
    });
  }

  /**
   *
   * Adds a handler function which is called when the game responds to the user.
   *
   * @param {function} fn
   *
   * @memberOf Game
   */
  addResponseHandler(fn) {
    this.responseHandler = message => {
      const messageWithId = this.addMessageId(message);
      this.commandService.addCommand({user: message.user._id, valid: message.valid, command: message.message});
      return fn(messageWithId);
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
   * @param {function} handler
   *
   * @memberOf Game
   */
  addMoveHandler(handler) {
    this.moveHandler = ({user, to, from }) => {
      this.moveService.addMove({user: user._id, start: from, end: to});
      return handler({user, to, from });
    };
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
   * Has player look at some object and describe it.
   *
   * @param {string} thing Thing to look at
   *
   * @memberOf Game
   */
  async lookAt(user, item) {
    const result = {user};
    const itemsHere = await this.itemService.getItemsHere(user);
    const desiredItem = itemsHere.filter(i=>i.name === item)[0];
    if (desiredItem) {
      result.success = true;
      result.message = desiredItem.inspect();
    } else {
      result.success = false;
      result.message = `There is no ${item} here.`;
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
  lookAround(user) {
    const result = {};
    result.message = this.map[makePlaceKey(user)].describe();

    const itemsHere = this.itemService.getItemsHere({user});
    if (itemsHere !== undefined) {
      const str = `<br/> In this room there's ${listize(itemsHere)}.`;
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
  openThing(user, item) {}

  /**
   *
   * Uses an item which can be used.
   *
   * @memberOf Game
   */
  useThing(user, item, target) {}

  /**
   *
   * Does the actual moving. Calls .onEnter() of the square moved into.
   *
   * @param {string} curPos
   * @param {string} nextPos
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
