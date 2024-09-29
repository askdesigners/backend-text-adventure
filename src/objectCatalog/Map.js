const Item = require("../entities/Item.entity");

class Map extends Item {
  constructor(initPayload) {
    super(initPayload);
  }
}

const MapDescription = {
  name: "Map",
  description: "An old map showing the nearby area. Useful for navigation.",
  canHold: true,
  canUse: true,
  situation: "view",
  canOpen: true,
  isLocked: false,
  useLimit: 0,
  consumable: false,
  hasRequirement: false,
  effect: null, // No immediate effect but essential for exploration
};

module.exports = (dbItem) => {
  return new Map({ ...dbItem, ...MapDescription });
};
