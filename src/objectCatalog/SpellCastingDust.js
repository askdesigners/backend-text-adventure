const Item = require("../entities/Item.entity");

class SpellCastingDust extends Item {
  constructor(initPayload) {
    super(initPayload);
  }
}

const SpellCastingDustDescription = {
  name: "Spell Casting Dust",
  description: "A pouch of magical dust. It enhances the power of spell casting.",
  canHold: true,
  canUse: true,
  situation: "on",
  canOpen: false,
  isLocked: false,
  useLimit: 5,
  consumable: true,
  hasRequirement: false,
  effect: {
    magicPower: {
      op: "+",
      value: 2,
      probability: 100,
      messageSuccess: "Your spell casting power is enhanced."
    }
  },
};

module.exports = (dbItem) => {
  return new SpellCastingDust({ ...dbItem, ...SpellCastingDustDescription });
};
