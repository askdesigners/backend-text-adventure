const Item = require("../entities/Item.entity");

class Rake extends Item {
  constructor(initPayload) {
    super(initPayload);
  }
}

const RakeDescription = {
  name: "Rake",
  description: "A simple rake. Useful for clearing leaves or defending yourself.",
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
      value: 1,
      probability: 100,
      messageSuccess: "You use the rake to defend yourself."
    }
  },
};

module.exports = (dbItem) => {
  return new Rake({ ...dbItem, ...RakeDescription });
};
