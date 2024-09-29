const Item = require("../entities/Item.entity");

class Shield extends Item {
  constructor(initPayload) {
    super(initPayload);
  }
}

const ShieldDescription = {
  name: "Shield",
  description: "A sturdy shield. It offers protection in combat.",
  canHold: true,
  canUse: true,
  situation: "equip",
  canOpen: false,
  isLocked: false,
  useLimit: 0,
  consumable: false,
  hasRequirement: false,
  effect: {
    defense: {
      op: "+",
      value: 3,
      probability: 100,
      messageSuccess: "You raise the shield and block incoming attacks."
    }
  },
};

module.exports = (dbItem) => {
  return new Shield({ ...dbItem, ...ShieldDescription });
};
