/* eslint-disable class-methods-use-this */
const commands = require("./gameData/commands");
const validators = require("./gameData/validators");
const listize = require("./parsing/listize");
const {moveResponse} = require("../dataSchemas");

function makePlaceKey({x, y}){
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
  constructor({ map, messageBus, parser, moveService, userService, itemService, listeners = [] }) {
    this.turn = 0;
    this.map = map;
    this.messageBus = messageBus;
    this.parser = parser;
    this.userService = userService;
    this.itemService = itemService;
    this.moveService = moveService;
    this.listeners = listeners;
    this.setupParsing();
    this.setupListeners();
  }

  async setupListeners(){
    await this.messageBus.connect();
    this.listeners(this).map((listener)=>{
      this.messageBus.makeSubscription(listener);
    });
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
    const result = this.parser.parse(user, text);
    return result;
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
    this.chatHandler({
      user,
      message,
      source: "playerChat"
    });
  }

  /**
   *
   * Moves the player on the map.
   *
   * @param {string} dir Direction to walk - {n,s,e,w}
   *
   * @memberOf Game
   */
  async moveTo(user, dir) {
    const startPos = makePlaceKey(user);
    const nextPos = this.map[startPos].getNeighbor(dir);
    const result = this._determineMove(user, startPos, nextPos);
    if (result.success === true) {
      // apply the move and other mods to the user, and return it for the UI
      result.user = await this.commitMoveMutations({user, from: startPos, to: nextPos, mods: result.mods });
      result.dir = dir;
      result.message = `Moved ${dir}`;
    }
    moveResponse.validate(result);
    return result;
  }

  /**
   *
   * Moves the player back to the previous place.
   *
   * @memberOf Game
   */
  async moveBack(user) {
    try {
      const startPos = makePlaceKey(user);
      const next = this.moveHistory[this.moveHistory.length - 2];
      const dir = this._getMoveDir(startPos, next);
      const result = this._determineMove(user, this.currentPosition, next);
      if (result.success === true) {
        const { user, success } = await this.commitMoveMutations({user, from: startPos, to: nextPos, mods: result.mods });
        result.success = success;
        result.user = user;
        result.dir = dir;
        result.message = `Moved ${dir}`;
      }
      return result;
    } catch (error) {
      return {
        success: false,
        error
      };
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
    return result;
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
    return result;
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
    return {
      user,
      success: false,
      valid: false,
      source: "game",
      message: "I don't follow you...",
    };
  }

  /**
   *
   * Adds a handler function which is called when the player moves to a new square.
   *
   * @param {function} handler
   *
   * @memberOf Game
   */
  async commitMoveMutations({user, mods, to, from }){
    const [ x, y ] = to.split("|");

    // write the move to the DB for history, but no need to wait
    this.moveService.addMove({user: user._id, start: from, end: to});

    // build a mutation based on what the handler returns
    const mod = this.userService.deriveUserModification(user, mods);

    return this.userService.mutateUser(user, { x, y, ...mod });
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
    return result;
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
    return result;
  }

  /**
   *
   * Opens an openable object.
   *
   * @memberOf Game
   */
  // eslint-disable-next-line no-unused-vars
  openThing(user, item) {}

  /**
   *
   * Uses an item which can be used.
   *
   * @memberOf Game
   */
  // eslint-disable-next-line no-unused-vars
  useThing(user, item, target) {}

  /**
   *
   * Decides if the move is possible. 
   * Calls .onEnter() of the square moved into.
   * This function can be defined in the map builder, otherwise will use a default success function.
   *
   * @param {string} curPos
   * @param {string} nextPos
   * @returns
   *
   * @memberOf Game
   */
  _determineMove(user, curPos, nextPos) {
    let result = {
      valid: true,
      source: "game",
      success: true
    };
    try { 
      if (nextPos !== false) {
        const enterResult = this.map[nextPos].onEnter(user);
        if (enterResult.success === true) {
          const {
            key,
            name,
            descriptiveName,
            description,
            x,
            y,
            z,
            toN,
            toE,
            toS,
            toW,
          } = this.map[nextPos];

          result = {
            place: {
              key,
              name,
              descriptiveName,
              description,
              x,
              y,
              z,
              toN,
              toE,
              toS,
              toW, 
            },
            mods: enterResult.mods,
            ...result
          };          
          this.map[curPos].onLeave();
        } else {
          result.success = false;
          result.message = enterResult.message;
        }
      } else {
        result.success = false;
        result.message = "That way is blocked";
      }
    } catch (error) {
      result.success = false;
      result.message = "It would appear that the universe has conspired against your wishes...";
    }
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
