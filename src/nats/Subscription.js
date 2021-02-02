const { JSONCodec } = require("nats");
const crypto = require("crypto");
const {decode, encode} = JSONCodec();
const userService = require("../services/user.service");
const { serverResponse } = require("../dataSchemas");

const gameServerQueue = { queue: "game.workers" };

const sleep = (n) => new Promise((res) => setTimeout(res, n));

const addMessageId = (message) =>{
  const id = crypto.randomBytes(16).toString("hex");
  message.id = id;
  return message;
};

const decodeJwt = async (message)=>{
  const {jwt} = message;
  if(jwt){
    const token = userService.decodeJwt(jwt);
    const user = await userService.getUser({_id: token._id});
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

const validateResponse = (response)=>{
  serverResponse.validate(response);
  return response;
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

  async applyMiddleware(message){
    if(this.middleware.length){
      message = await this.middleware.reduce(async (msg, mdw) => {
        await sleep(10);
        return await mdw(msg);
      }, message);
    }
    return message;
  }

  async startListening(){
    console.info(`[NATS] Listening to ${this.sub.getSubject()} : ${this.authenticated}`);
    for await (const message of this.sub) {
      const parsed = decodeData(message.data);
      const applied = await this.applyMiddleware(parsed);
      
      let reply ;
      try {
        const result = await this.handler(applied);
        validateResponse(result); // ensure the response is well formed
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