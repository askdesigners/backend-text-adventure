
class Place {
  constructor({
    name,
    descriptiveName,
    description,
    x,
    y,
    z = 0,
    toN,
    toE,
    toS,
    toW,
    blockedTo,
    onEnter = null,
    onLeave = null,
    onCanEnter
  }) {
    // name :               short but readable name
    // descriptiveName :    longer more descriptive name
    // position :           coordinate, like 'a4'
    // level :              like the floor in a building
    // description :        is read on enter
    // blockedTo :          directions not possible to travel in from here like, ['w','s']
    // onEnter :            Function to call on enter
    // onCanEnter :         Function to check if we can enter
    // onLeave :            Function to call on leave
    this.key = `${x}|${y}`;
    this.name = name;
    this.descriptiveName = descriptiveName;
    this.description = description;
    this.x = x;
    this.y = y;
    this.z = z;
    this.toN = toN;
    this.toE = toE;
    this.toS = toS;
    this.toW = toW;
    this.blockedTo = blockedTo;
    this.onEnterAction = onEnter;
    this.onLeaveAction = onLeave;
    this.canEnterAction = onCanEnter;
  }

  describe() {
    return this.description;
  }

  canEnter(user) {
    // can check state for things here
    if (typeof this.canEnterAction === "function") {
      return this.canEnterAction(user, this);
    }
    return true;
  }

  onEnter(user) {
    const response = {};
    if (this.canEnter()) {
      // things can happen!
      response.place = {
        name: this.name,
        descriptiveName: this.descriptiveName,
        blockedTo: this.blockedTo,
      };
      response.message = this.describe();
      response.success = true;
      if (typeof this.onEnterAction === "function") this.onEnterAction(user, this);
    } else {
      response.message = "You can't go that way.";
      response.success = false;
    }
    return response;
  }

  onLeave(user) {
    // things can happen!
    if (typeof this.onLeaveAction === "function") {
      return this.onLeaveAction(user, this);
    }
  }

  getNeighbor(dir) {
    if (dir == "west" || dir == "w") return this.toW;
    if (dir == "north" || dir == "n") return this.toN;
    if (dir == "south" || dir == "s") return this.toS;
    if (dir == "east" || dir == "e") return this.toE;
  }
}

module.exports = Place;
