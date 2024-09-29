const Item = require("../entities/Item.entity");

class RawCarrots extends Item {
  constructor(initPayload) {
    super(initPayload);
  }
}

const RawCarrotsDescription = {
  name: "Raw Carrots",
  description: "A handful of raw carrots. Can be eaten for a small health boost.",
  canHold: true,
  canUse: true,
  situation: "on",
  canOpen: false,
  isLocked: false,
  useLimit: 3,
  consumable: true,
  hasRequirement: false,
  effect: {
    health: {
      op: "+",
      value: 1,
      probability: 100,
      messageSuccess: "You munch on the carrots and feel a bit healthier."
    }
  },
};

module.exports = (dbItem) => {
  return new RawCarrots({ ...dbItem, ...RawCarrotsDescription });
};
