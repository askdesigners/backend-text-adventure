const Item = require("../entities/Item.entity");

class RawPotato extends Item {
  constructor(initPayload) {
    super(initPayload);
  }
}

const RawPotatoDescription = {
  name: "Raw Potato",
  description: "A raw potato. It might not be very tasty until it's cooked.",
  canHold: true,
  canUse: false,
  situation: "on",
  canOpen: false,
  isLocked: false,
  useLimit: 0,
  consumable: false,
  hasRequirement: true,
  requirementMessage: "You need to cook the potato before eating it.",
  effect: null, // No effect until cooked
};

module.exports = (dbItem) => {
  return new RawPotato({ ...dbItem, ...RawPotatoDescription });
};
