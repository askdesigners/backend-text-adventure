const Item = require("../entities/Item.entity");

class RawFish extends Item {
  constructor(initPayload) {
    super(initPayload);
  }
}

const RawFishDescription = {
  name: "Raw Fish",
  description: "A slimy raw fish. It could be cooked for better use.",
  canHold: true,
  canUse: false,
  situation: "on",
  canOpen: false,
  isLocked: false,
  useLimit: 0,
  consumable: false,
  hasRequirement: true,
  requirementMessage: "You need to cook the fish before consuming it.",
  effect: {
    health: {
      op: "-",
      value: 1,
      probability: 50,
      messageSuccess: "Eating raw fish made you feel sick."
    }
  },
};

module.exports = (dbItem) => {
  return new RawFish({ ...dbItem, ...RawFishDescription });
};
