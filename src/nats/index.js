const { connect } = require("nats");
const Subscription = require("./Subscription");
const Publisher = require("./Publisher");

module.exports = class NatsClient{
  constructor({servers}){
    this.natClient = null;
    this.servers = servers;
  }
  
  async connect (opts){
    this.natsClient = await connect({headers: true, servers: this.servers, ...opts});
    console.log("[NATS] connected");
  }
  
  makeSubscription(options){
    return new Subscription({...options, client: this.natsClient});
  }
  
  makePublisher(){
    this.publisher = new Publisher(this.natsClient);
  }
  
  makeRequestor(){
    this.requestor = new Publisher(this.natsClient);
  }
};