module.exports = class {
  constructor(id, model, beforeUpdate){
    this.id = id;
    this.model = model;
    this.beforeUpdate = beforeUpdate;
    this.props = []; // list of fields to merge with db data
  }

  async commit(changes){
    try {
      await this.beforeUpdate(changes);
      return this.model.update({
        _id: this.id
      }, changes);
    } catch (error) {
      return {
        success: false,
        error
      };
    }
  }
  
  fetchDbItem(){
    // gets item from db
    return this.model.findOne({
      _id: this.id
    });
  }

  getFullItem(){
    const item = this.fetchDbItem();
    const props = this.props.reduce((map, prop)=>{
      map[prop] = this[prop];
      return map;
    },{});
    return {...item, ...props};
  }
};