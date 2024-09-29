const Item = require("../entities/Item.entity");

class WaterFlask extends Item {
  constructor(initPayload) {
    super(initPayload);
  }
}

const WaterFlaskDescription = {
  name: "Water Flask",
  description: "A sturdy water flask. Can be used to restore some hydration.",
  canHold: true,
  canUse: true,
  situation: "on",
  canOpen: false,
  isLocked: false,
  useLimit: 3,
  consumable: true,
  hasRequirement: false,
  effect: {
    hydration: {
      op: "+",
      value: 3,
      probability: 100,
      messageSuccess: "You feel refreshed after drinking from the flask."
    }
  },
};

module.exports = (dbItem) => {
  return new WaterFlask({ ...dbItem, ...WaterFlaskDescription });
};
