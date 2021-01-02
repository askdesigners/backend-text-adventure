const models = require("../../db/models");
const Item = models.getModel("Item");
const ItemEntity =require("../../entities/Item.entity");

exports.getNearbyItems = function (x, y) {
  const items = Item.find({
    x: {
      $gte: x - 1,
      $lte: x + 1,
    },
    y: {
      $gte: y - 1,
      $lte: y + 1,
    }
  });

  return items.map(new ItemEntity);
};

exports.getNearbyPlayers = function (x, y) {
  const items = Item.find({
    x: {
      $gte: x - 1,
      $lte: x + 1,
    },
    y: {
      $gte: y - 1,
      $lte: y + 1,
    }
  });

  return items.map(new ItemEntity);
};