const models = require("../../db/models");
const Command = models.getModel("Command");

exports.getLastCommands = async function (userId, limit = 10) {
  const lastCommand = await Command.find({
    user: userId
  })
    .sort({createdAt: -1})
    .limit(limit);

  return lastCommand;
};

exports.addCommand = async function (Command) {
  return new Command(Command).save();
};
