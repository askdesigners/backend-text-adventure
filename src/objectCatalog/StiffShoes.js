const Item = require("../entities/Item.entity");

class StiffShoes extends Item {
  constructor(initPayload) {
    super(initPayload);
  }
}

const StiffShoesDescription = {
  name: "Stiff Shoes for Climbing",
  description: "A pair of stiff shoes designed for climbing. Increases climbing ability.",
  canHold: true,
  canUse: true,
  situation: "wear",
  canOpen: false,
  isLocked: false,
  useLimit: 0,
  consumable: false,
  hasRequirement: false,
  effect: {
    climbing: {
      op: "+",
      value: 3,
      probability: 100,
      messageSuccess: "Your climbing ability improves with the stiff shoes."
    }
  },
};

module.exports = (dbItem) => {
  return new StiffShoes({ ...dbItem, ...StiffShoesDescription });
};
