const Item = require("../entities/Item.entity");

class ToolBox extends Item {
  constructor(initPayload) {
    super(initPayload);
  }
}

const ToolBoxDescription = {
  name: "Tool Box",
  description: "A box filled with tools. Useful for repairing items or building things.",
  canHold: true,
  canUse: true,
  situation: "on",
  canOpen: true,
  isLocked: false,
  useLimit: 0,
  consumable: false,
  hasRequirement: false,
  effect: {
    repair: {
      op: "+",
      value: 3,
      probability: 100,
      messageSuccess: "You use the tools to repair something."
    }
  },
};

module.exports = (dbItem) => {
  return new ToolBox({ ...dbItem, ...ToolBoxDescription });
};
