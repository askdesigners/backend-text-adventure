const Item = require("../entities/Item.entity");

// we create a unique class here as we have the opportunity to add
// any special methods we want alongside the definition

class BookKey extends Item{
  constructor(initPayload){
    super(initPayload);
  }
}

const ItemDescription = {
  name: "Book Key",
  description: "The key is heavy. Looks pretty old as well. There's an inscription reading \"With love\".",
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
  return new BookKey({...dbItem, ...ItemDescription});
};