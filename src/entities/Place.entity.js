// const {observable} from "mobx";

class Place {
  constructor({
    name,
    descriptiveName,
    position,
    description,
    level = 0,
    blockedTo,
    onEnter = null,
    onLeave = null,
    canEnter,
    colorTheme,
  }) {
    // name :               short but readable name
    // descriptiveName :    longer more descriptive name
    // position :           coordinate, like 'a4'
    // level :              like the floor in a building
    // description :        is read on enter
    // blockedTo :          directions not possible to travel in from here like, ['w','s']
    // onEnter :            Function to call on enter
    // onLeave :            Function to call on leave

    this.name = name;
    this.description = description;
    this.descriptiveName = descriptiveName;
    this.position = position;
    this.level = level;
    this.blockedTo = blockedTo;
    this.onEnterAction = onEnter;
    this.onLeaveAction = onLeave;
    this.canEnterAction = canEnter;
    this.colorTheme = colorTheme;
  }

  describe() {
    return this.description;
  }

  canEnter() {
    // can check state for things here

    if (typeof this.canEnterAction === "function") {
      return this.canEnterAction(this);
    }
    return true;
  }

  onEnter() {
    const response = {};
    if (this.canEnter()) {
      // return false or true
      // things can happen!
      response.place = {
        name: this.name,
        descriptiveName: this.descriptiveName,
        blockedTo: this.blockedTo,
      };
      response.message = this.describe();
      response.success = true;
      if (typeof this.onEnterAction === "function") this.onEnterAction(this);
    } else {
      response.message = "You can't go that way.";
      response.success = false;
    }
    return response;
  }

  onLeave() {
    // things can happen!
    // also pass this the mobx state
    if (typeof this.onLeaveAction === "function") this.onLeaveAction(this);
  }

  getNeighbor(dir) {
    if (dir == "west" || dir == "w") return this.toW;
    if (dir == "north" || dir == "n") return this.toN;
    if (dir == "south" || dir == "s") return this.toS;
    if (dir == "east" || dir == "e") return this.toE;
  }
}

export default Place;
