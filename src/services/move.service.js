const models = require("../db/models");

exports.getLastMove = async function (userId) {
  const Move = models.getModel("Move");
  const lastMove = await Move.findOne({
    user: userId
  }).sort({createdAt: -1});

  return lastMove;
};

exports.addMove = async function (move) {
  const Move = models.getModel("Move");
  return new Move(move).save();
};
