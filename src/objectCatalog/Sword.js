const Item = require("../entities/Item.entity");

class Sword extends Item {
  constructor(initPayload) {
    super(initPayload);
  }
}

const SwordDescription = {
  name: "Sword",
  description: "A long, sharp sword. A powerful weapon for combat.",
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
      value: 4,
      probability: 100,
      messageSuccess: "You swing the sword with precision."
    }
  },
};

module.exports = (dbItem) => {
  return new Sword({ ...dbItem, ...SwordDescription });
};
