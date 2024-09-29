const Item = require("../entities/Item.entity");

class BowlOfSoup extends Item {
  constructor(initPayload) {
    super(initPayload);
  }
}

const BowlOfSoupDescription = {
  name: "Bowl of Soup",
  description: "A warm bowl of soup. It smells delicious and restores some health.",
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
      value: 2,
      probability: 100,
      messageSuccess: "You feel refreshed and healthy!"
    }
  },
};

module.exports = (dbItem) => {
  return new BowlOfSoup({ ...dbItem, ...BowlOfSoupDescription });
};
