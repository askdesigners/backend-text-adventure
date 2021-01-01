const { Keystone } = require("@keystonejs/keystone");
const { AdminUIApp } = require("@keystonejs/app-admin-ui");
const nats = require("./src/nats");
const { MongooseAdapter } = require("@keystonejs/adapter-mongoose");

const models = require("./src/lists");

const PROJECT_NAME = "text-engine";
const adapterConfig = { mongoUri: "mongodb://localhost/text-engine" };


const keystone = new Keystone({
  cookieSecret: "blarp",
  adapter: new MongooseAdapter(adapterConfig),
});

Object.keys(models).forEach(key => {
  keystone.createList(key, models[key]);
  console.info(`[ Model ${key} loaded ]`);
});

nats.connect();

module.exports = {
  keystone,
  apps: [
    new AdminUIApp({ name: PROJECT_NAME }),
    // new GraphQLApp({
    //   // All config keys are optional. Default values are shown here for completeness.
    //   apiPath: "/admin/api",
    //   graphiqlPath: "/admin/graphiql",
    //   schemaName: "admin",
    //   apollo: {},
    // }),
  ],
};
