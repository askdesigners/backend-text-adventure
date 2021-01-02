const Item = require("../entities/Item.entity");

// we create a unique class here as we have the opportunity to add
// any special methods we want alongside the definition

class BookOfSpells extends Item{
  constructor(initPayload){
    super(initPayload);
  }
}
const ItemDescription = {
  name: "Book of Spells",
  description: "The book is brown with a golden imprint. It's rather tattered looking.",
  canHold: true,
  canUse: true,
  situation: "on",
  canOpen: true,
  isLocked: true,
  useLimit: 0,
  consumable: true,
  hasRequirement: false,
};

module.exports = (dbItem) => {
  return new BookOfSpells({...dbItem, ...ItemDescription});
};