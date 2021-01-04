const models = require("../../db/models");
const Item = models.getModel("Item");
const ItemEntity =require("../../entities/Item.entity");

exports.getItemsInRadius = async function ({x, y, radius = 1}) {
  const items = await Item.find({
    x: {
      $gte: x - radius,
      $lte: x + radius,
    },
    y: {
      $gte: y - radius,
      $lte: y + radius,
    }
  });

  return items.map(new ItemEntity);
};

exports.getItemsHere = async function ({x, y}) {
  const items = await Item.find({x, y});
  return items.map(new ItemEntity);
};