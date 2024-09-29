const Item = require("../entities/Item.entity");

class CanOfBeans extends Item {
  constructor(initPayload) {
    super(initPayload);
  }
}

const CanOfBeansDescription = {
  name: "Can of Beans",
  description: "A can of beans. It restores some energy when consumed.",
  canHold: true,
  canUse: true,
  situation: "on",
  canOpen: true,
  isLocked: false,
  useLimit: 1,
  consumable: true,
  hasRequirement: false,
  effect: {
    energy: {
      op: "+",
      value: 2,
      probability: 100,
      messageSuccess: "The beans give you a small boost of energy."
    }
  },
};

module.exports = (dbItem) => {
  return new CanOfBeans({ ...dbItem, ...CanOfBeansDescription });
};
