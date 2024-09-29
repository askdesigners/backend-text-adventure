const Item = require("../entities/Item.entity");

class Lantern extends Item {
  constructor(initPayload) {
    super(initPayload);
  }
}

const LanternDescription = {
  name: "Lantern",
  description: "A metal lantern. It can be used to light dark areas.",
  canHold: true,
  canUse: true,
  situation: "on",
  canOpen: false,
  isLocked: false,
  useLimit: 0,
  consumable: false,
  hasRequirement: true,
  requirement: 'oilCan',
  effect: null, // Provides light in dark environments
};

module.exports = (dbItem) => {
  return new Lantern({ ...dbItem, ...LanternDescription });
};
