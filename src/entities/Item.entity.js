const Base = require("Base.entity");
const model = require("../db/models").getModel("Item");

class Item extends Base{
  constructor(props) {
    super({...props, model});
  }

  applyProps(props){
    this.canHold = props.canHold;
    this.heldBy = props.heldBy;
    this.canUse = props.canUse;
    this.x = props.x;
    this.y = props.y;
    this.situation = props.situation;
    this.canOpen = props.canOpen;
    this.isLocked = props.isLocked;
    this.useCount = props.useCount;
    this.useLimit = props.useLimit;
    this.consumable = props.consumable;
    this.hasRequirement = props.hasRequirement;
    this.requirement = props.requirement;
    this.effect = props.effect;
  }

  use(quantity = 1, targetUser) {
    if(this.consumable && this.useCount >= this.useLimit) {
      return {
        success: false,
        message: "Looks like you can't use this item any more..."
      };
    }
    targetUser.applyItemEffect(this.effect);
    this.useCount = this.useCount + quantity;
    this.commit();
    if(this.consumable && this.useCount >= this.useLimit) {
      return {
        success: true,
        message: "This item is now depleted."
      };
    }
    return {
      success: true
    };
  }

  onDrop(user) {
    // unhold, and set to user's current x,y
    this.x = user.x;
    this.y = user.y;
    this.heldBy = null;
    this.commit();
  }

  onPickUp(user) {
    var response = {};
    if (this.canPickUp()) {
      response.success = true;
      response.message = this.inspect();
      this.x = null;
      this.y = null;
      this.heldBy = user._id;
      user.pickUpItem(this);
      this.commit();
    } else {
      response.success = false;
      response.message = "You can't pick that up.";
    }
    return response;
  }

  canPickUp() {
    return true;
  }

  inspect() {
    return this.description;
  }
}

module.exports = Item;
