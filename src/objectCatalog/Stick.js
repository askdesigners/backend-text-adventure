const Item = require("../entities/Item.entity");

class Stick extends Item {
  constructor(initPayload) {
    super(initPayload);
  }
}

const StickDescription = {
  name: "Stick",
  description: "A simple wooden stick. Useful for crafting or as a weak weapon.",
  canHold: true,
  canUse: false,
  situation: "on",
  canOpen: false,
  isLocked: false,
  useLimit: 0,
  consumable: false,
  hasRequirement: false,
  effect: null, // No immediate effect
};

module.exports = (dbItem) => {
  return new Stick({ ...dbItem, ...StickDescription });
};
