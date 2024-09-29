const Item = require("../entities/Item.entity");

class Wheelbarrow extends Item {
  constructor(initPayload) {
    super(initPayload);
  }
}

const WheelbarrowDescription = {
  name: "Wheelbarrow",
  description: "A wooden wheelbarrow. Useful for carrying heavy items.",
  canHold: false,
  canUse: true,
  situation: "on",
  canOpen: true,
  isLocked: false,
  useLimit: 0,
  consumable: false,
  hasRequirement: false,
  effect: null, // Used for carrying items
};

module.exports = (dbItem) => {
  return new Wheelbarrow({ ...dbItem, ...WheelbarrowDescription });
};
