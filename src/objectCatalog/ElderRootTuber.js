const Item = require("../entities/Item.entity");

class ElderRootTuber extends Item {
  constructor(initPayload) {
    super(initPayload);
  }
}

const ElderRootTuberDescription = {
  name: "Elder Root Tuber",
  description: "A strange, ancient root tuber with possible magical properties.",
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
      value: 10,
      probability: 70,
      messageSuccess: "You feel a surge of vitality as you consume the tuber."
    }
  },
};

module.exports = (dbItem) => {
  return new ElderRootTuber({ ...dbItem, ...ElderRootTuberDescription });
};
