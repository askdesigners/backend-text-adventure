const Item = require("../entities/Item.entity");

class WoolShirt extends Item {
  constructor(initPayload) {
    super(initPayload);
  }
}

const WoolShirtDescription = {
  name: "Wool Shirt",
  description: "A warm wool shirt. Offers moderate protection from the cold.",
  canHold: true,
  canUse: true,
  situation: "wear",
  canOpen: false,
  isLocked: false,
  useLimit: 0,
  consumable: false,
  hasRequirement: false,
  effect: {
    warmth: {
      op: "+",
      value: 1,
      probability: 100,
      messageSuccess: "You feel warmer in the wool shirt."
    }
  },
};

module.exports = (dbItem) => {
  return new WoolShirt({ ...dbItem, ...WoolShirtDescription });
};
