module.exports = class {
  constructor({_id, name, description, model, beforeUpdate}){
    this.id = _id;
    this.name = name;
    this.description = description;
    this.id = _id;
    this.model = model;
    this.beforeUpdate = beforeUpdate;
  }

  async commit(){
    try {
      if(this.beforeUpdate) await this.beforeUpdate(this);
      await this.model.update({
        _id: this.id
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