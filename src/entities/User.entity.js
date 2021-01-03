const Base = require("./Base.entity.js");
const model = require("../db/models").getModel("User");

module.exports = class extends Base{
  constructor(props){
    super({...props, model});
    this.commit();
    this.applyProps(props);
  }

  logOn(){
    this.status = "active";
    this.commit();
  }
  
  logOff(){
    this.status = "inactive";
    this.commit();
  }

  applyProps(props){
    this.x = props.x;
    this.y = props.y;
    this.holding = props.holding;
    this.inventory = props.inventory;
    this.health = props.health;
    this.strength = props.strength;
    this.status = props.status;
  }

  pickUpItem(item){
    this.inventory.push(item._id);
    this.commit();
  }
  
  applyItemEffect(itemEffect){
    const effects = Object.keys(itemEffect);
    const effectResults = {};
    effects.forEach(efc => {
      if(efc.probability < 10){
        const attempt = Math.floor(Math.random() * Math.floor(10));
        if(attempt < effects[efc].probability){
          return effectResults[efc] = {
            success: false,
            message: effects[efc].messageFailure || "Hmm, looks like that didn't work..."
          };
        }
      }
      
      // a prop not matching the user model, bail
      if(!this[efc]) return {};

      switch(effects[efc].op){
      case "+":
        this[efc] = this[efc] || 0 + effects[efc].value;
        break;
      case "-":
        this[efc] = this[efc] || 0 - effects[efc].value;
        break;
      case "*":
        this[efc] = this[efc] || 0 * effects[efc].value;
        break;
      default:
        console.log("[ User ] unknown effect operator", efc, effects[efc]);
      }
      effectResults[efc] = {
        success: true,
        message: effects[efc].messageFailure
      };
    });
    this.commit();
    return effectResults;
  }
};