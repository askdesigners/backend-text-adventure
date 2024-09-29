const Item = require("../entities/Item.entity");

class RescueWhistle extends Item {
  constructor(initPayload) {
    super(initPayload);
  }
}

const RescueWhistleDescription = {
  name: "Rescue Whistle",
  description: "A loud whistle. Can be used to call for help in emergencies.",
  canHold: true,
  canUse: true,
  situation: "on",
  canOpen: false,
  isLocked: false,
  useLimit: 0,
  consumable: false,
  hasRequirement: false,
  effect: {
    callHelp: {
      op: "+",
      value: 1,
      probability: 100,
      messageSuccess: "You blow the whistle loudly, signaling for help."
    }
  },
};

module.exports = (dbItem) => {
  return new RescueWhistle({ ...dbItem, ...RescueWhistleDescription });
};
