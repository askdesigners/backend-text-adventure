class Thing {
  constructor({
    name,
    canHold,
    heldBy = null,
    canUse,
    description,
    position,
    situation = "on",
    canOpen = false,
    isLocked = false,
    useCount = 0,
    useLimit = 0,
    consumable = false,
    hasRequirement = false,
    requirement,
  }) {
    this.name = name;
    this.id = name;
    this.canHold = canHold;
    this.heldBy = heldBy;
    this.canUse = canUse;
    this.description = description;
    this.position = position;
    this.situation = situation;
    this.canOpen = canOpen;
    this.isLocked = isLocked;
    this.useCount = useCount;
    this.useLimit = useLimit;
    this.consumable = consumable;
    this.hasRequirement = hasRequirement;
    this.requirement = hasRequirement ? requirement : null;
  }

  use(quantity = 1) {
    this.useCount = this.useCount + quantity;
  }

  onDrop() {}

  onPickUp() {
    var response = {};
    if (this.canPickUp()) {
      response.message = this.inspect();
      response.success = true;
    } else {
      response.message = "You can't pick that up.";
      response.success = false;
    }
    return response;
  }

  canPickUp() {
    // if(this.hasRequirement){} and requirent is met
    return true;
  }

  inspect() {
    return this.description;
  }
}

module.exports = Thing;
