const Item = require("../entities/Item.entity");

class CatFood extends Item {
  constructor(initPayload) {
    super(initPayload);
  }
}

const CatFoodDescription = {
  name: "Cat Food",
  description: "A tin of cat food. It can be used to feed a cat or as bait.",
  canHold: true,
  canUse: true,
  situation: "on",
  canOpen: true,
  isLocked: false,
  useLimit: 1,
  consumable: true,
  hasRequirement: false,
  effect: null, // Used to feed a cat or lure animals
};

module.exports = (dbItem) => {
  return new CatFood({ ...dbItem, ...CatFoodDescription });
};
