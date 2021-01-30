const { JSONCodec } = require("nats");
const gameServerQueue = { queue: "game.workers" };
const {decode, encode} = JSONCodec();
const userService = require("../services/user.service");
const crypto = require("crypto");

const addMessageId = (message) =>{
  const id = crypto.randomBytes(16).toString("hex");
  message.id = id;
  return message;
};

const decodeJwt = (message)=>{
  const {jwt} = message;
  if(jwt){
    const user = userService.decodeJwt(jwt);
    message.user = user;
  } else {
    message.error = "no user token found";
  }
  return message;
};

const decodeData = (message)=>{
  const body = decode(message);
  const {jwt} = body;
  delete body.jwt;
  return {body, jwt};
};

module.exports = class NatsSubscription {
  constructor({client, subject, middleware = [], authenticated, handler}){
    this.client = client;
    this.sub = this.client.subscribe(subject, gameServerQueue);
    this.handler = handler;
    this.middleware = [];
    this.authenticated = authenticated;
    
    if(authenticated){
      this.use(decodeJwt);
    }
    
    this.use(addMessageId);

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
    console.info(`[NATS] Listening to ${this.sub.getSubject()} : ${this.authenticated}`);
    for await (const message of this.sub) {
      const parsed = decodeData(message.data);
      const applied = this.applyMiddleware(parsed);
      
      let reply ;
      try {
        const result = await this.handler(applied);
        reply = await message.respond(encode(result));
      } catch (error) {
        console.error(error);
        reply = await message.respond(encode({error, message: "server error", success: false}));
      }

      if (reply) {
        console.info(`[NATS] message on ${this.sub.getSubject()} – ${this.sub.getProcessed()}`);
      } else {
        console.log(`[NATS] skip reply to message on ${this.sub.getSubject()}`);
      }      
    }
  }
};