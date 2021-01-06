const { JsonCodec } = require("nats");
const gameServerQueue = { queue: "game.workers" };
const {decode, encode} = JsonCodec();

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
  return {...message, body: decode(message.data)};
};

module.exports = class NatsSubscription {
  constructor({client, subject, middleware, authenticated, handler}){
    this.client = client;
    this.sub = this.client.subscribe(subject, gameServerQueue);
    this.handler = handler;
    this.use(decodeData);
    if(authenticated){
      this.use(decodeJwt);
    }
    if(middleware.length){
      middleware.forEach(mw => {
        this.use(mw);
      });
    }
    this.startListening().then(() => {
      console.log(`subscription ${subject} closed`);
    });
  }

  use(middleware){
    this.middleware.push(middleware);
  }

  applyMiddleware(message){
    if(this.middleware.length){
      this.middleware.reduce((msg, mdw)=>mdw(msg), message);
    }
  }

  async startListening(){
    console.info(`[NATS] Listening to ${this.sub.getSubject()}`);
    for await (const message of this.sub) {
      const parsed = this.applyMiddleware(message);
      const result = this.handler(parsed);
      if (message.respond(encode(result))) {
        console.info(`[NATS] message on ${this.sub.getSubject()} – ${this.sub.getProcessed()}`);
      } else {
        console.log(`[NATS] skip reply to message on ${this.sub.getSubject()}`);
      }      
    }
  }
};