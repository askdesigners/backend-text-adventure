const Item = require("../entities/Item.entity");

class SmallStone extends Item {
  constructor(initPayload) {
    super(initPayload);
  }
}

const SmallStoneDescription = {
  name: "Small Stone",
  description: "A small, smooth stone. It could be thrown or used in crafting.",
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
  return new SmallStone({ ...dbItem, ...SmallStoneDescription });
};
