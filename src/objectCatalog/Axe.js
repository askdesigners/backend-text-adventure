const Item = require("../entities/Item.entity");

class Axe extends Item {
  constructor(initPayload) {
    super(initPayload);
  }
}

const AxeDescription = {
  name: "Axe",
  description: "A sharp axe. Useful for cutting wood or as a weapon.",
  canHold: true,
  canUse: true,
  situation: "equip",
  canOpen: false,
  isLocked: false,
  useLimit: 0,
  consumable: false,
  hasRequirement: false,
  effect: {
    attack: {
      op: "+",
      value: 3,
      probability: 100,
      messageSuccess: "You swing the axe with force."
    }
  },
};

module.exports = (dbItem) => {
  return new Axe({ ...dbItem, ...AxeDescription });
};
