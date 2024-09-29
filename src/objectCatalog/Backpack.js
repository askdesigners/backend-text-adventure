const Item = require("../entities/Item.entity");

class Backpack extends Item {
  constructor(initPayload) {
    super(initPayload);
  }
}

const BackpackDescription = {
  name: "Backpack",
  description: "A sturdy backpack. Allows you to carry more items.",
  canHold: true,
  canUse: true,
  situation: "equip",
  canOpen: true,
  isLocked: false,
  useLimit: 0,
  consumable: false,
  hasRequirement: false,
  effect: null, // Used for carrying items
};

module.exports = (dbItem) => {
  return new Backpack({ ...dbItem, ...BackpackDescription });
};
