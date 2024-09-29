const Item = require("../entities/Item.entity");

class Spyglass extends Item {
  constructor(initPayload) {
    super(initPayload);
  }
}

const SpyglassDescription = {
  name: "Spyglass",
  description: "A brass spyglass. It allows you to see distant objects more clearly.",
  canHold: true,
  canUse: true,
  situation: "view",
  canOpen: false,
  isLocked: false,
  useLimit: 0,
  consumable: false,
  hasRequirement: false,
  effect: {
    vision: {
      op: "+",
      value: 2,
      probability: 100,
      messageSuccess: "You see far into the distance using the spyglass."
    }
  },
};

module.exports = (dbItem) => {
  return new Spyglass({ ...dbItem, ...SpyglassDescription });
};
