const Item = require("../entities/Item.entity");

// we create a unique class here as we have the opportunity to add
// any special methods we want alongside the definition

class Apple extends Item{
  constructor(initPayload){
    super(initPayload);
  }
}

const AppleDescription = {
  name: "Juicy Apple",
  description: "A delicious looking red apple. Eat it for +0.5 health.",
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
      value: 0.5,
      probability: 10,
      messageSuccess: "Delicious!"
    }
  },
};

module.exports = (dbItem) => {
  return new Apple({...dbItem, ...AppleDescription});
};