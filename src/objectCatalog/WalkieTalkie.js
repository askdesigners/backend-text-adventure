const Item = require("../entities/Item.entity");

class WalkieTalkie extends Item {
  constructor(initPayload) {
    super(initPayload);
  }
}

const WalkieTalkieDescription = {
  name: "Walkie Talkie",
  description: "A walkie-talkie device. Useful for long-distance communication.",
  canHold: true,
  canUse: true,
  situation: "on",
  canOpen: false,
  isLocked: false,
  useLimit: 0,
  consumable: false,
  hasRequirement: true,
  requirementMessage: "You need another walkie-talkie to communicate.",
  effect: null, // Used for communication
};

module.exports = (dbItem) => {
  return new WalkieTalkie({ ...dbItem, ...WalkieTalkieDescription });
};
