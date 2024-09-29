const Item = require("../entities/Item.entity");

class OldBook extends Item {
  constructor(initPayload) {
    super(initPayload);
  }
}

const OldBookDescription = {
  name: "Old Book with Cryptic Writing",
  description: "An ancient book filled with cryptic text. It may contain magical secrets.",
  canHold: true,
  canUse: true,
  situation: "view",
  canOpen: true,
  isLocked: false,
  useLimit: 0,
  consumable: false,
  hasRequirement: false,
  effect: {
    knowledge: {
      op: "+",
      value: 1,
      probability: 50,
      messageSuccess: "You decipher some of the cryptic text and feel a surge of knowledge."
    }
  },
};

module.exports = (dbItem) => {
  return new OldBook({ ...dbItem, ...OldBookDescription });
};
