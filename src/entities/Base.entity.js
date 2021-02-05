const models = require("../db/models");

module.exports = class {
  constructor({_id, name, description, modelName, beforeUpdate}){
    this.modelName = modelName;
    this.model = models.getModel(modelName);
    this._id = _id.toString();
    this.name = name;
    this.description = description;
    this.beforeUpdate = beforeUpdate;
  }

  async commit(){
    try {
      if(this.beforeUpdate) await this.beforeUpdate(this);
      await this.model.updateOne({
        _id: this._id
      }, this);
      return {
        succes: true
      };
    } catch (error) {
      return {
        success: false,
        error
      };
    }
  }
};