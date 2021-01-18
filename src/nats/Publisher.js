const { JSONCodec } = require("nats");
const encoder = JSONCodec().encode;

module.exports = class NatsPublisher {
  constructor(client){
    this.client = client;
  }

  async send({subject, payload}){
    // simple push without a response
    return this.client.publish(subject, encoder(payload));
  }
};