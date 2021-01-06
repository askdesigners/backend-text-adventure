const { JsonCodec } = require("nats");
const encoder = JsonCodec().encode;

module.exports = class NatsPublisher {
  constructor(client){
    this.client = client;
  }

  async send({subject, payload}){
    return this.client.publish(subject, encoder(payload));
  }
};