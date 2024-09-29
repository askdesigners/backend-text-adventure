const Item = require("../entities/Item.entity");

class Shovel extends Item {
  constructor(initPayload) {
    super(initPayload);
  }
}

const ShovelDescription = {
  name: "Shovel",
  description: "A sturdy shovel. Useful for digging.",
  canHold: true,
  canUse: true,
  situation: "equip",
  canOpen: false,
  isLocked: false,
  useLimit: 0,
  consumable: false,
  hasRequirement: false,
  effect: {
    dig: {
      op: "+",
      value: 1,
      probability: 100,
      messageSuccess: "You dig a hole with the shovel."
    }
  },
};

module.exports = (dbItem) => {
  return new Shovel({ ...dbItem, ...ShovelDescription });
};
