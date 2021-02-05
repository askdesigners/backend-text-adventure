module.exports = class Validator{
  constructor(name, schema, opts){
    this.schema = schema;
    this.name = name;
    this.opts = opts;
  }
  validate(data){
    const {error} = this.schema.validate(data, this.opts);
    // if(error) throw new TypeError(error);
    if(error) console.error("[ VALIDATOR FAIL ]", error.details);
    return;
  }
};