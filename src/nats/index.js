const NATS = require("nats");
const config = require("config");
const servers = config.get("nats.servers");
const gameServerQueue = { queue: "game.workers" };
let natsClient;

function setListeners(nc){

  // emitted whenever there's an error. if you don't implement at least
  // the error handler, your program will crash if an error is emitted.
  nc.on("error", (err) => {
    console.error(`[NATS] ${err}`);
  });

  // connect callback provides a reference to the connection as an argument
  nc.on("connect", (nc) => {
    console.log(`[NATS] connect to ${nc.currentServer.url.host}`);
  });

  // emitted whenever the client disconnects from a server
  nc.on("disconnect", () => {
    console.log("[NATS] disconnect");
  });

  // emitted whenever the client is attempting to reconnect
  nc.on("reconnecting", () => {
    console.log("[NATS] reconnecting");
  });

  // emitted whenever the client reconnects
  // reconnect callback provides a reference to the connection as an argument
  nc.on("reconnect", (nc) => {
    console.log(`[NATS] reconnect to ${nc.currentServer.url.host}`);
  });

  // emitted when the connection is closed - once a connection is closed
  // the client has to create a new connection.
  nc.on("close", function () {
    console.log("[NATS] close");
  });

  natsClient = nc;
}

exports.connect = ()=>{
  console.log("[NATS] connecting NATS");
  setListeners(NATS.connect({ servers: servers, json: true  }));
};

exports.subscribe = (subject, callback)=>{
  // Subscription/Request callbacks are given multiple arguments:
  // - msg is the payload for the message
  // - reply is an optional reply subject set by the sender (could be undefined)
  // - subject is the subject the message was sent (which may be more specific
  //   than the subscription subject - see "Wildcard Subscriptions".
  // - finally the subscription id is the local id for the subscription
  //   this is the same value returned by the subscribe call.
  natsClient.subscribe(subject, gameServerQueue, (msg, reply, subject, sid)=>{
    callback({msg, reply, subject, sid}, natsClient);
  });
};

exports.nc = natsClient;