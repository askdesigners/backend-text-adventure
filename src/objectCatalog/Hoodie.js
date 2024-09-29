const Item = require("../entities/Item.entity");

class Hoodie extends Item {
  constructor(initPayload) {
    super(initPayload);
  }
}

const HoodieDescription = {
  name: "Hoodie",
  description: "A comfortable hoodie. Keeps you warm and blends you into a crowd.",
  canHold: true,
  canUse: true,
  situation: "wear",
  canOpen: false,
  isLocked: false,
  useLimit: 0,
  consumable: false,
  hasRequirement: false,
  effect: {
    warmth: {
      op: "+",
      value: 1,
      probability: 100,
      messageSuccess: "You feel warmer in the hoodie."
    },
    stealth: {
      op: "+",
      value: 1,
      probability: 100,
      messageSuccess: "You pass undetected."
    },
  },
};

module.exports = (dbItem) => {
  return new Hoodie({ ...dbItem, ...HoodieDescription });
};
