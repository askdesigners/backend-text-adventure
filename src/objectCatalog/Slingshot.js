const Item = require("../entities/Item.entity");

class Slingshot extends Item {
  constructor(initPayload) {
    super(initPayload);
  }
}

const SlingshotDescription = {
  name: "Slingshot",
  description: "A simple slingshot. It can fire small stones.",
  canHold: true,
  canUse: true,
  situation: "equip",
  canOpen: false,
  isLocked: false,
  useLimit: 0,
  consumable: false,
  hasRequirement: true,
  requirementMessage: "You need small stones to use the slingshot.",
  effect: {
    attack: {
      op: "+",
      value: 2,
      probability: 100,
      messageSuccess: "You launch a stone with precision."
    }
  },
};

module.exports = (dbItem) => {
  return new Slingshot({ ...dbItem, ...SlingshotDescription });
};
