const Item = require("../entities/Item.entity");

// we create a unique class here as we have the opportunity to add
// any special methods we want alongside the definition

class BeerCan extends Item{
  constructor(initPayload){
    super(initPayload);
  }
}

const ItemDescription = {
  name: "Underwire Bra",
  description: "A lacey undergarment. Large enough to wear as a Roman war helmet.",
  canHold: true,
  canUse: true,
  situation: "on",
  canOpen: false,
  isLocked: false,
  useLimit: 0,
  consumable: false,
  hasRequirement: false,
};

module.exports = (dbItem) => {
  return new BeerCan({...dbItem, ...ItemDescription});
};