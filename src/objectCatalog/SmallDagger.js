const Item = require("../entities/Item.entity");

class SmallDagger extends Item {
  constructor(initPayload) {
    super(initPayload);
  }
}

const SmallDaggerDescription = {
  name: "Small Dagger",
  description: "A short, sharp dagger. Useful for close combat.",
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
      value: 2,
      probability: 100,
      messageSuccess: "You strike swiftly with the dagger."
    }
  },
};

module.exports = (dbItem) => {
  return new SmallDagger({ ...dbItem, ...SmallDaggerDescription });
};
