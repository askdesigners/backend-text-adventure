const Item = require("../entities/Item.entity");

class HealthPotion extends Item {
  constructor(initPayload) {
    super(initPayload);
  }
}

const HealthPotionDescription = {
  name: "Health Potion",
  description: "A small vial filled with a glowing red liquid. Restores health when consumed.",
  canHold: true,
  canUse: true,
  situation: "on",
  canOpen: false,
  isLocked: false,
  useLimit: 1,
  consumable: true,
  hasRequirement: false,
  effect: {
    health: {
      op: "+",
      value: 5,
      probability: 100,
      messageSuccess: "You feel rejuvenated after drinking the potion."
    }
  },
};

module.exports = (dbItem) => {
  return new HealthPotion({ ...dbItem, ...HealthPotionDescription });
};
