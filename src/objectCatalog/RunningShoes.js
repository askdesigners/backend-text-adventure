const Item = require("../entities/Item.entity");

class RunningShoes extends Item {
  constructor(initPayload) {
    super(initPayload);
  }
}

const RunningShoesDescription = {
  name: "Running Shoes",
  description: "Lightweight shoes designed for running. Increases your speed.",
  canHold: true,
  canUse: true,
  situation: "wear",
  canOpen: false,
  isLocked: false,
  useLimit: 0,
  consumable: false,
  hasRequirement: false,
  effect: {
    speed: {
      op: "+",
      value: 2,
      probability: 100,
      messageSuccess: "You feel faster with the running shoes on."
    }
  },
};

module.exports = (dbItem) => {
  return new RunningShoes({ ...dbItem, ...RunningShoesDescription });
};
