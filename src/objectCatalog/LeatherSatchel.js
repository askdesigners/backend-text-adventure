const Item = require("../entities/Item.entity");

class LeatherSatchel extends Item {
  constructor(initPayload) {
    super(initPayload);
  }
}

const LeatherSatchelDescription = {
  name: "Leather Satchel",
  description: "A small leather satchel. Can be used to store items.",
  canHold: true,
  canUse: true,
  situation: "wear",
  canOpen: true,
  isLocked: false,
  useLimit: 0,
  consumable: false,
  hasRequirement: false,
  effect: null, // Used for holding items
};

module.exports = (dbItem) => {
  return new LeatherSatchel({ ...dbItem, ...LeatherSatchelDescription });
};
