const models = require("../../db/models");
const Move = models.getModel("Move");

exports.getLastMove = async function (userId) {
  const lastMove = await Move.findOne({
    user: userId
  }).sort({createdAt: -1});

  return lastMove;
};

exports.addMove = async function (move) {
  return new Move(move).save();
};
