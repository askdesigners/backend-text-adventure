const Item = require("../entities/Item.entity");

class InvisibilityGem extends Item {
  constructor(initPayload) {
    super(initPayload);
  }
}

const InvisibilityGemDescription = {
  name: "Invisibility Gem",
  description: "A mysterious gem that grants temporary invisibility when used.",
  canHold: true,
  canUse: true,
  situation: "on",
  canOpen: false,
  isLocked: false,
  useLimit: 1,
  consumable: true,
  hasRequirement: false,
  effect: {
    invisibility: {
      op: "+",
      value: 10,
      duration: 60, // Lasts for 60 seconds
      probability: 100,
      messageSuccess: "You become invisible for a short time."
    }
  },
};

module.exports = (dbItem) => {
  return new InvisibilityGem({ ...dbItem, ...InvisibilityGemDescription });
};
