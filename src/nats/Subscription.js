const { JSONCodec } = require("nats");
const gameServerQueue = { queue: "game.workers" };
const {decode, encode} = JSONCodec();

const decodeJwt = (message)=>{
  const {jwt} = message.headers;
  message.user = {
    _id: "dummyuser",
    jwt
  };
  // error: "somethign" to reject this message
  return message;
};

const decodeData = (message)=>{
  console.log(decode(message));
  return {body: decode(message)};
};

module.exports = class NatsSubscription {
  constructor({client, subject, middleware = [], authenticated, handler}){
    this.client = client;
    this.sub = this.client.subscribe(subject, gameServerQueue);
    this.handler = handler;
    this.middleware = [];
    if(authenticated){
      this.use(decodeJwt);
    }
    if(middleware.length){
      middleware.forEach(mw => {
        this.use(mw);
      });
    }
    this.startListening().then(() => {
      console.log(`[NATS] subscription ${subject} closed`);
    });
  }

  use(middleware){
    this.middleware.push(middleware);
  }

  applyMiddleware(message){
    if(this.middleware.length){
      message = this.middleware.reduce((msg, mdw)=>mdw(msg), message);
    }
    return message;
  }

  async startListening(){
    console.info(`[NATS] Listening to ${this.sub.getSubject()}`);
    for await (const message of this.sub) {
      const parsed = decodeData(message.data);
      const applied = this.applyMiddleware(parsed);
      const result = await this.handler(applied);
      if (message.respond(encode({success: true, ...result}))) {
        console.info(`[NATS] message on ${this.sub.getSubject()} – ${this.sub.getProcessed()}`);
      } else {
        console.log(`[NATS] skip reply to message on ${this.sub.getSubject()}`);
      }      
    }
  }
};