const Item = require("../entities/Item.entity");

class MedicKit extends Item {
  constructor(initPayload) {
    super(initPayload);
  }
}

const MedicKitDescription = {
  name: "Medic Kit",
  description: "A basic medical kit. Can be used to heal injuries.",
  canHold: true,
  canUse: true,
  situation: "on",
  canOpen: true,
  isLocked: false,
  useLimit: 1,
  consumable: true,
  hasRequirement: false,
  effect: {
    health: {
      op: "+",
      value: 5,
      probability: 100,
      messageSuccess: "You bandage your wounds and feel better."
    }
  },
};

module.exports = (dbItem) => {
  return new MedicKit({ ...dbItem, ...MedicKitDescription });
};
